const axios = require('axios');

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FILE_KEY = process.env.FIGMA_FILE_KEY || 'pedjRw2Wv7VOWugjqBgc6t';

async function fetchFigmaFile() {
  try {
    const response = await axios.get(`https://api.figma.com/v1/files/${FILE_KEY}`, {
      headers: { 'X-Figma-Token': FIGMA_TOKEN }
    });
    return response.data;
  } catch (error) {
    console.error('Figma API Error:', error.response?.data || error.message);
    throw error;
  }
}

async function getTemplateImages(nodeIds) {
  try {
    const response = await axios.get(
      `https://api.figma.com/v1/images/${FILE_KEY}?ids=${nodeIds.join(',')}&format=png&scale=2`,
      { headers: { 'X-Figma-Token': FIGMA_TOKEN } }
    );
    return response.data.images;
  } catch (error) {
    console.error('Figma Images Error:', error.response?.data || error.message);
    throw error;
  }
}

function extractAllNodes(node, parentX = 0, parentY = 0) {
  const result = {
    id: node.id,
    name: node.name,
    type: node.type,
    x: (node.absoluteBoundingBox?.x || 0) - parentX,
    y: (node.absoluteBoundingBox?.y || 0) - parentY,
    width: node.absoluteBoundingBox?.width || 0,
    height: node.absoluteBoundingBox?.height || 0,
    rotation: node.rotation || 0,
    opacity: node.opacity !== undefined ? node.opacity : 1,
    visible: node.visible !== false
  };

  // Text specific
  if (node.type === 'TEXT') {
    result.text = node.characters;
    result.fontSize = node.style?.fontSize || 14;
    result.fontFamily = node.style?.fontFamily || 'Inter';
    result.fontWeight = node.style?.fontWeight || 400;
    result.textAlign = node.style?.textAlignHorizontal?.toLowerCase() || 'left';
    result.textAlignVertical = node.style?.textAlignVertical?.toLowerCase() || 'top';
    result.letterSpacing = node.style?.letterSpacing || 0;
    result.lineHeight = node.style?.lineHeightPx || node.style?.fontSize || 14;
    result.textDecoration = node.style?.textDecoration || 'NONE';
  }

  // Rectangle/Shape specific
  if (node.type === 'RECTANGLE' || node.type === 'ELLIPSE' || node.type === 'VECTOR') {
    result.cornerRadius = node.cornerRadius || 0;
    result.fills = node.fills || [];
    result.strokes = node.strokes || [];
    result.strokeWeight = node.strokeWeight || 0;
  }

  // Image specific
  if (node.fills && node.fills.length > 0) {
    const imageFill = node.fills.find(fill => fill.type === 'IMAGE');
    if (imageFill) {
      result.imageRef = imageFill.imageRef;
      result.scaleMode = imageFill.scaleMode;
    }
  }

  // Color fills
  if (node.fills && node.fills.length > 0) {
    result.fills = node.fills.map(fill => ({
      type: fill.type,
      color: fill.color,
      opacity: fill.opacity,
      blendMode: fill.blendMode
    }));
  }

  // Effects (shadows, blur)
  if (node.effects && node.effects.length > 0) {
    result.effects = node.effects;
  }

  // Children
  if (node.children && node.children.length > 0) {
    result.children = node.children.map(child =>
      extractAllNodes(child, parentX, parentY)
    );
  }

  return result;
}

async function parseTemplates() {
  const fileData = await fetchFigmaFile();
  const templates = [];
  const frameIds = [];

  // Get all frames from first page
  const page = fileData.document.children[0];

  for (const frame of page.children) {
    if (frame.type === 'FRAME') {
      frameIds.push(frame.id);

      // Extract complete structure
      const structure = extractAllNodes(
        frame,
        frame.absoluteBoundingBox?.x || 0,
        frame.absoluteBoundingBox?.y || 0
      );

      templates.push({
        name: frame.name,
        figmaId: frame.id,
        width: frame.absoluteBoundingBox?.width || 800,
        height: frame.absoluteBoundingBox?.height || 1100,
        backgroundColor: frame.backgroundColor || { r: 1, g: 1, b: 1, a: 1 },
        structure: structure // Complete JSON structure with all nodes
      });
    }
  }

  // Get preview images for all frames
  const frameImages = await getTemplateImages(frameIds);

  // Collect all image-containing node IDs
  const imageNodeIds = [];
  templates.forEach(template => {
    function findImageNodes(node) {
      if (node.imageRef) {
        imageNodeIds.push(node.id);
      }
      if (node.children) {
        node.children.forEach(findImageNodes);
      }
    }
    findImageNodes(template.structure);
  });

  // Get embedded images if any exist
  let embeddedImages = {};
  if (imageNodeIds.length > 0) {
    try {
      embeddedImages = await getTemplateImages(imageNodeIds);
    } catch (error) {
      console.warn('Could not fetch embedded images:', error.message);
    }
  }

  // Add URLs to templates
  templates.forEach(template => {
    template.previewImage = frameImages[template.figmaId];
    template.embeddedImages = embeddedImages;
  });

  return templates;
}

module.exports = { parseTemplates, fetchFigmaFile, extractAllNodes };



