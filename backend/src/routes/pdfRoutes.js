const express = require('express');
const pdfService = require('../../services/pdfService');
const router = express.Router();

router.post('/generate-resume-pdf', async (req, res) => {
  try {
    const { html, filename = 'resume.pdf' } = req.body;

    if (!html) {
      console.error('❌ No HTML content provided');
      return res.status(400).json({ error: 'HTML content is required' });
    }

    console.log('📄 Generating PDF for resume...');
    console.log('HTML length:', html.length);

    // Check if puppeteer is available
    try {
      const pdf = await pdfService.generateResumePDF(html);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(pdf);

      console.log('✅ PDF generated successfully');
    } catch (pdfError) {
      console.error('❌ Puppeteer error:', pdfError);
      console.error('Error stack:', pdfError.stack);

      // Return detailed error for debugging
      return res.status(500).json({
        error: 'Failed to generate PDF with Puppeteer',
        details: pdfError.message,
        stack: process.env.NODE_ENV === 'development' ? pdfError.stack : undefined
      });
    }

  } catch (error) {
    console.error('❌ PDF generation error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      error: 'Failed to generate PDF',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;