const puppeteer = require('puppeteer');
const { embedFontsAsBase64 } = require('./fontEmbedder');

class PDFService {
  constructor() {
    this.browser = null;
  }

  async initBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-web-security',
          // ── Font rendering flags for maximum PDF text quality ──
          '--font-render-hinting=none',        // Let the PDF viewer handle hinting
          '--disable-lcd-text',                 // Disable LCD subpixel — pure grayscale AA
          '--enable-font-antialiasing',         // Ensure AA is on
        ]
      });
    }
    return this.browser;
  }

  async generateResumePDF(htmlContent, options = {}) {
    let browser = null;
    let page = null;

    try {
      console.log('🚀 Initializing browser for high-quality PDF...');
      browser = await this.initBrowser();

      // ─────────────────────────────────────────────────────────────────────
      // STEP 1 — Resolve CSS @import rules.
      // The HTML may contain @import url('...googleapis...') inside <style>.
      // We fetch those CSS files, which contain @font-face with font file URLs,
      // and inline them so that Step 2 (font embedding) can find every font URL.
      // ─────────────────────────────────────────────────────────────────────
      console.log('📋 Resolving @import CSS rules...');
      htmlContent = await this.resolveImports(htmlContent);

      // ─────────────────────────────────────────────────────────────────────
      // STEP 2 — Embed all font binaries as base64.
      // This is the same approach as Word: fonts are stored inside the
      // document so rendering is 100% deterministic. No network calls at
      // render time = pixel-perfect output on any machine.
      // ─────────────────────────────────────────────────────────────────────
      console.log('🔤 Embedding fonts as base64...');
      const embeddedHtml = await embedFontsAsBase64(htmlContent);

      console.log('📄 Creating new page...');
      page = await browser.newPage();

      // ─────────────────────────────────────────────────────────────────────
      // STEP 3 — Viewport: exact A4 at 96 DPI.
      // 816px = 8.5″ × 96 DPI (US Letter / A4 column width).
      // deviceScaleFactor: 3 → 3× supersampled raster elements (images,
      // gradients, canvas, box-shadows). Text is vector regardless — this
      // only helps rasterised content look Retina-sharp.
      // ─────────────────────────────────────────────────────────────────────
      await page.setViewport({
        width: 816,
        height: 1056,
        deviceScaleFactor: 3
      });

      // ─────────────────────────────────────────────────────────────────────
      // STEP 4 — Load the HTML.
      // Fonts are base64-embedded, so 'networkidle0' confirms everything
      // is fully parsed without waiting on external requests.
      // ─────────────────────────────────────────────────────────────────────
      console.log('📝 Setting HTML content...');
      await page.setContent(embeddedHtml, {
        waitUntil: ['load', 'domcontentloaded'],
        timeout: 60000
      });

      // ─────────────────────────────────────────────────────────────────────
      // STEP 5 — Wait for fonts to be fully parsed and applied.
      // Even with base64 data URIs, Chrome parses font binaries async.
      // We wait for document.fonts.ready AND add a small CSS paint buffer.
      // ─────────────────────────────────────────────────────────────────────
      await page.evaluate(() => document.fonts.ready);

      // Verify fonts loaded successfully
      const fontStatus = await page.evaluate(() => {
        const fonts = [];
        document.fonts.forEach(f => {
          fonts.push({ family: f.family, weight: f.weight, status: f.status });
        });
        return { count: fonts.length, fonts: fonts.slice(0, 20) };
      });
      console.log(`🔤 ${fontStatus.count} font face(s) loaded:`,
        fontStatus.fonts.map(f => `${f.family} ${f.weight}: ${f.status}`).join(', '));

      // Small buffer for CSS paint, animations, late layout
      await new Promise(resolve => setTimeout(resolve, 800));

      // ─────────────────────────────────────────────────────────────────────
      // STEP 6 — Generate the PDF.
      // Puppeteer's page.pdf() produces a TRUE vector PDF:
      //   • Text is stored as selectable glyphs, not raster images
      //   • Fonts are subset & embedded in the PDF stream
      //   • Zoom to 400% and text is still razor-sharp
      // This matches the quality of Canva, Figma, and Word exports.
      // ─────────────────────────────────────────────────────────────────────
      console.log('🖨️ Generating vector PDF...');
      const pdf = await page.pdf({
        format: 'A4',
        width: '210mm',
        height: '297mm',
        printBackground: true,
        preferCSSPageSize: false,
        margin: {
          top: '0',
          right: '0',
          bottom: '0',
          left: '0'
        },
        timeout: 60000,
        ...options
      });

      console.log(`✅ PDF generated successfully (${(pdf.length / 1024).toFixed(1)} KB)`);
      return pdf;

    } catch (error) {
      console.error('❌ Error in generateResumePDF:', error.message);
      console.error('Error stack:', error.stack);

      if (error.message.includes('timeout')) {
        throw new Error('PDF generation timed out. The resume might be too complex. Please try again.');
      } else if (error.message.includes('Protocol error')) {
        throw new Error('Browser communication error. Please try again.');
      } else if (error.message.includes('Target closed')) {
        this.browser = null; // Reset so next call re-launches
        throw new Error('Browser was closed unexpectedly. Please try again.');
      }

      throw error;
    } finally {
      if (page) {
        try {
          await page.close();
        } catch (e) {
          console.error('Error closing page:', e.message);
        }
      }
    }
  }

  /**
   * Resolves CSS @import url(...) directives in <style> blocks.
   * Fetches the referenced CSS (e.g. Google Fonts stylesheet) and inlines
   * its content directly, so the font file URLs become visible to the
   * font embedder in Step 2.
   */
  async resolveImports(html) {
    const https = require('https');
    const http = require('http');

    // Match @import url('...') inside the HTML
    const importRegex = /@import\s+url\(\s*['"]?(https?:\/\/[^'")\s]+)['"]?\s*\)\s*;?/g;
    const imports = [];
    let match;

    while ((match = importRegex.exec(html)) !== null) {
      imports.push({ fullMatch: match[0], url: match[1] });
    }

    if (imports.length === 0) return html;

    console.log(`📋 Found ${imports.length} @import rule(s) to resolve...`);

    // Fetch each import in parallel
    const results = await Promise.all(
      imports.map(async (imp) => {
        try {
          const cssText = await this._fetchText(imp.url);
          console.log(`  ✅ Resolved: ${imp.url.substring(0, 80)}... (${cssText.length} bytes)`);
          return { ...imp, cssText };
        } catch (err) {
          console.warn(`  ⚠️  Could not resolve @import: ${imp.url} — ${err.message}`);
          return { ...imp, cssText: '' };
        }
      })
    );

    // Replace each @import with the fetched CSS content
    let result = html;
    for (const r of results) {
      if (r.cssText) {
        result = result.replace(r.fullMatch, `/* Resolved: ${r.url} */\n${r.cssText}`);
      }
    }

    return result;
  }

  /**
   * Fetches a URL as text. Uses the appropriate User-Agent header to get
   * woff2 font URLs from Google Fonts (they return different formats
   * based on the UA string).
   */
  _fetchText(url) {
    const https = require('https');
    const http = require('http');

    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;
      const request = protocol.get(url, {
        headers: {
          // Request woff2 (the modern, smallest, highest-quality format)
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/css,*/*;q=0.1'
        },
        timeout: 15000
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return this._fetchText(res.headers.location).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
        res.on('error', reject);
      });
      request.on('error', reject);
      request.on('timeout', () => {
        request.destroy();
        reject(new Error(`Timeout fetching ${url}`));
      });
    });
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

module.exports = new PDFService();