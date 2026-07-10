import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';


interface FigmaNode {
  id: string;
  name: string;
  type: string;
  text?: string;
  characters?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  textAlign?: string;
  fills?: any[];
  children?: FigmaNode[];
}

interface Template {
  _id: string;
  name: string;
  structure: FigmaNode;
  width: number;
  height: number;
  backgroundColor: string;
}

const TemplatePreview: React.FC = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTemplate = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:5000/api/figma/templates/${templateId}`);
      setTemplate(response.data);
    } catch (error) {
      console.error('Error fetching template:', error);
    } finally {
      setIsLoading(false);
    }
  }, [templateId]);

  useEffect(() => {
    fetchTemplate();
  }, [templateId, fetchTemplate]);

  const renderNode = (node: FigmaNode): React.ReactNode => {
    if (!node) return null;

    // Handle TEXT nodes
    if (node.type === 'TEXT') {
      const textContent = node.characters || node.text || '';
      
      return (
        <div
          key={node.id}
          style={{
            position: 'absolute',
            left: `${node.x}px`,
            top: `${node.y}px`,
            width: `${node.width}px`,
            height: `${node.height}px`,
            fontSize: `${node.fontSize || 12}px`,
            fontWeight: node.fontWeight || 400,
            color: getFillColor(node.fills),
            fontFamily: node.fontFamily || 'Arial',
            textAlign: (node.textAlign?.toLowerCase() || 'left') as any,
            boxSizing: 'border-box',
            pointerEvents: 'none',
          }}
        >
          {textContent}
        </div>
      );
    }

    // Handle RECTANGLE and IMAGE nodes
    if (node.type === 'RECTANGLE' || node.type === 'IMAGE') {
      return (
        <div
          key={node.id}
          style={{
            position: 'absolute',
            left: `${node.x}px`,
            top: `${node.y}px`,
            width: `${node.width}px`,
            height: `${node.height}px`,
            backgroundColor: getFillColor(node.fills),
            boxSizing: 'border-box',
            pointerEvents: 'none',
          }}
        />
      );
    }

    // Handle container nodes (FRAME, GROUP, etc.)
    if (node.children) {
      return (
        <React.Fragment key={node.id}>
          {node.children.map((child) => renderNode(child))}
        </React.Fragment>
      );
    }

    return null;
  };

  const getFillColor = (fills: any[] | undefined): string => {
    if (!fills || fills.length === 0) return 'transparent';
    const fill = fills[0];
    if (fill.type === 'SOLID' && fill.color) {
      const { r, g, b, a = 1 } = fill.color;
      return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
    }
    return 'transparent';
  };

  if (isLoading || !template) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading template preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/templates')}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              ← Back to Templates
            </button>
          </div>
          <h1 className="text-2xl font-bold">
            {template.name} - Preview
          </h1>
          <button
            className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            onClick={() => navigate(`/resume-editor/template/${templateId}`)}
          >
            Use This Template
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8 flex justify-center">
          <div
            style={{
              position: 'relative',
              width: `${template.width}px`,
              height: `${template.height}px`,
              backgroundColor: template.backgroundColor || '#fff',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
          >
            {template.structure && renderNode(template.structure)}
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          This is a preview of the template. Click "Use This Template" to customize it with your information.
        </div>
      </div>


    </div>
  );
};

export default TemplatePreview;