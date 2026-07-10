const express = require('express');
const router = express.Router();
const FigmaTemplate = require('../../models/FigmaTemplate');
const { parseTemplates } = require('../../services/figmaService');

// Import templates from Figma
router.get('/import', async (req, res) => {
  try {
    const templates = await parseTemplates();
    
    // Clear existing templates
    await FigmaTemplate.deleteMany({});
    
    // Insert new templates
    const saved = await FigmaTemplate.insertMany(templates);
    
    res.json({ 
      message: 'Templates imported successfully', 
      count: saved.length,
      templates: saved 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all templates
router.get('/templates', async (req, res) => {
  try {
    const templates = await FigmaTemplate.find({ isActive: true });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get template by ID
router.get('/templates/:id', async (req, res) => {
  try {
    const template = await FigmaTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
