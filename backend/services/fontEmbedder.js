const https = require('https');
const http = require('http');

/**
 * Fetches a URL and returns its content as a Buffer.
 * Uses a real browser User-Agent so Google Fonts / CDNs serve woff2 format.
 */
function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const request = protocol.get(url, {
      headers: {
        // Real Chrome UA — Google Fonts returns woff2 only to modern browsers
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*'
      },
      timeout: 20000
    }, (res) => {
      // Follow redirects (301 / 302)
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchBuffer(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });
    request.on('error', reject);
    request.on('timeout', () => {
      request.destroy();
      reject(new Error(`Timeout fetching ${url}`));
    });
  });
}

/**
 * Detects the correct MIME type for a font file from its URL or buffer magic bytes.
 */
function getFontMimeType(url, buffer) {
  // Check magic bytes first (most reliable)
  if (buffer && buffer.length >= 4) {
    const magic = buffer.slice(0, 4);
    // wOF2
    if (magic[0] === 0x77 && magic[1] === 0x4F && magic[2] === 0x46 && magic[3] === 0x32) return 'font/woff2';
    // wOFF
    if (magic[0] === 0x77 && magic[1] === 0x4F && magic[2] === 0x46 && magic[3] === 0x46) return 'font/woff';
    // TTF/OTF (version 0x00010000 or 'OTTO')
    if (magic[0] === 0x00 && magic[1] === 0x01 && magic[2] === 0x00 && magic[3] === 0x00) return 'font/truetype';
    if (magic[0] === 0x4F && magic[1] === 0x54 && magic[2] === 0x54 && magic[3] === 0x4F) return 'font/opentype';
  }
  // Fall back to URL extension
  const lower = url.toLowerCase().split('?')[0];
  if (lower.endsWith('.woff2')) return 'font/woff2';
  if (lower.endsWith('.woff'))  return 'font/woff';
  if (lower.endsWith('.ttf'))   return 'font/truetype';
  if (lower.endsWith('.otf'))   return 'font/opentype';
  if (lower.endsWith('.eot'))   return 'application/vnd.ms-fontobject';
  return 'font/woff2'; // safe default for Google Fonts
}

/**
 * Parses an HTML string, finds every external font URL inside @font-face src
 * declarations, downloads the font binary, converts it to a base64 data URI,
 * and replaces the original URL inline.
 *
 * This is what makes the PDF self-contained — fonts are fully embedded, so
 * the PDF renders identically on any machine, at any zoom level, with
 * razor-sharp text. Same approach as Canva, Figma, and Microsoft Word.
 *
 * @param {string} html - Full HTML string to process
 * @returns {Promise<string>} - HTML with all font URLs replaced by data URIs
 */
async function embedFontsAsBase64(html) {
  console.log('🔤 Scanning for external font URLs...');

  // Match every url(...) that starts with http inside the HTML
  // This catches fonts in @font-face src(), background-image url(), etc.
  const fontUrlRegex = /url\(\s*['"]?(https?:\/\/[^'"\s)]+)['"]?\s*\)/g;

  const uniqueUrls = new Set();
  let match;
  while ((match = fontUrlRegex.exec(html)) !== null) {
    const url = match[1];
    // Only embed font files — skip regular images/SVGs/CSS to keep size manageable
    if (
      /\.(woff2?|ttf|otf|eot)(\?|$)/i.test(url) ||
      url.includes('fonts.gstatic.com') ||
      url.includes('fonts.googleapis.com') && url.includes('.woff')
    ) {
      uniqueUrls.add(url);
    }
  }

  if (uniqueUrls.size === 0) {
    console.log('ℹ️  No external font URLs found — skipping font embedding.');
    return html;
  }

  console.log(`🔤 Embedding ${uniqueUrls.size} font file(s) as base64...`);

  // Fetch all font binaries in parallel for speed
  const urlToDataUri = new Map();
  const BATCH_SIZE = 10; // Process in batches to avoid overwhelming the network
  const urlArray = [...uniqueUrls];

  for (let i = 0; i < urlArray.length; i += BATCH_SIZE) {
    const batch = urlArray.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (url) => {
        try {
          const buffer = await fetchBuffer(url);
          const mimeType = getFontMimeType(url, buffer);
          const dataUri = `data:${mimeType};base64,${buffer.toString('base64')}`;
          urlToDataUri.set(url, dataUri);
          const sizeKB = (buffer.length / 1024).toFixed(1);
          console.log(`  ✅ Embedded (${sizeKB} KB): ${url.substring(0, 80)}...`);
        } catch (err) {
          // Non-fatal: if one font fails, the others still work
          console.warn(`  ⚠️  Could not embed font (will use fallback): ${url}`);
          console.warn(`      Reason: ${err.message}`);
        }
      })
    );
  }

  // Replace every occurrence of each URL in the HTML
  let result = html;
  for (const [url, dataUri] of urlToDataUri) {
    // Use split/join to replace all occurrences without regex escaping issues
    result = result.split(url).join(dataUri);
  }

  const embeddedCount = urlToDataUri.size;
  const skippedCount  = uniqueUrls.size - embeddedCount;
  const totalSizeKB = [...urlToDataUri.values()]
    .reduce((sum, uri) => sum + uri.length, 0) / 1024;
  console.log(`🔤 Font embedding complete: ${embeddedCount} embedded (${totalSizeKB.toFixed(0)} KB total), ${skippedCount} skipped.`);

  return result;
}

module.exports = { embedFontsAsBase64 };
