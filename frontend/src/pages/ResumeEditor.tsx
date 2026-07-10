import React, { useState, useEffect, useRef, useCallback } from 'react';
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

interface ResumeData {
  _id: string;
  userId: string;
  templateId: Template;
  data: {
    personalInfo?: any;
    summary?: string;
    experience?: any[];
    education?: any[];
    skills?: string[];
    projects?: any[];
    certifications?: any[];
  };
  customizations?: {
    colors?: { primary: string; secondary: string };
    font?: string;
  };
  enhancedData?: {
    basicInfo?: {
      fullName?: string;
    };
  };
}

const ResumeEditor: React.FC = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [editableNodes, setEditableNodes] = useState<Map<string, string>>(new Map());
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [alignmentGuides, setAlignmentGuides] = useState<{x: number[], y: number[]}>({ x: [], y: [] });
  
  // AI Chat Panel States
  const [editMode, setEditMode] = useState<'ai' | 'manual'>('ai');
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchResume = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:5000/api/resume/resumes/${resumeId}`);
      const resume = response.data.data;
      
      console.log('Resume loaded:', resume);
      setResumeData(resume);
      
      // Use filled template with AI-enhanced data
      if (resume.filledTemplate && resume.filledTemplate.structure) {
        console.log('✅ Using filled template with AI data');
        setTemplate(resume.filledTemplate);
        
        // Extract text from the filled template structure
        const textMap = new Map();
        const extractFilled = (node) => {
          if (node.type === 'TEXT' && (node.characters || node.text)) {
            textMap.set(node.id, node.characters || node.text);
          }
          if (node.children) {
            node.children.forEach(extractFilled);
          }
        };
        extractFilled(resume.filledTemplate.structure);
        setEditableNodes(textMap);

      } else {
        console.log('⚠️ No filled template, fetching original');
        // Fetch template separately
        const templateResponse = await axios.get(`http://localhost:5000/api/figma/templates/${resume.templateId}`);
        setTemplate(templateResponse.data);
        extractTextNodes(templateResponse.data.structure);
        
        // Pre-fill with enhanced data
        if (resume.enhancedData) {
          prefillResumeData(templateResponse.data.structure, resume.enhancedData);
        }

      }
    } catch (error) {
      console.error('Error fetching resume:', error);
    } finally {
      setIsLoading(false);
    }
  }, [resumeId]);

  useEffect(() => {
    fetchResume();
  }, [resumeId, fetchResume]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const sendAiPrompt = async (prompt: string) => {
    if (!prompt.trim() || isAiProcessing) return;
    
    setIsAiProcessing(true);
    setChatMessages(prev => [...prev, { role: 'user', content: prompt }]);
    setCurrentPrompt('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/ai/enhance-resume', {
        prompt,
        currentResumeData: {
          template: template,
          editableNodes: Object.fromEntries(editableNodes),
          resumeData: resumeData
        }
      });
      
      const aiResponse = response.data;
      setChatMessages(prev => [...prev, { role: 'ai', content: aiResponse.message }]);
      
      // Apply live changes to resume
      if (aiResponse.updatedNodes) {
        const newEditableNodes = new Map(editableNodes);
        Object.entries(aiResponse.updatedNodes).forEach(([nodeId, text]) => {
          newEditableNodes.set(nodeId, text as string);
        });
        setEditableNodes(newEditableNodes);
      }
      
    } catch (error) {
      console.error('AI Enhancement Error:', error);
      setChatMessages(prev => [...prev, { 
        role: 'ai', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsAiProcessing(false);
    }
  };

  const extractTextNodes = (node: FigmaNode) => {
    const textMap = new Map<string, string>();
    const traverse = (n: FigmaNode) => {
      if (n.type === 'TEXT' && n.text) {
        textMap.set(n.id, n.text);
      }
      if (n.children) {
        n.children.forEach(traverse);
      }
    };
    traverse(node);
    setEditableNodes(textMap);
  };

  const prefillResumeData = (structure: FigmaNode, enhancedData: any) => {
    const textMap = new Map<string, string>();
    const traverse = (n: FigmaNode) => {
      if (n.type === 'TEXT' && n.characters) {
        // Use the already filled text from Figma structure
        textMap.set(n.id, n.characters);
      }
      if (n.children) {
        n.children.forEach(traverse);
      }
    };
    traverse(structure);
    setEditableNodes(textMap);
  };

  const updateText = (nodeId: string, newText: string) => {
    setEditableNodes(new Map(editableNodes.set(nodeId, newText)));
  };

  const getAllNodes = (node: FigmaNode, excludeId?: string): FigmaNode[] => {
    let nodes: FigmaNode[] = [];
    if (node.id !== excludeId && (node.type === 'TEXT' || node.type === 'RECTANGLE' || node.type === 'IMAGE')) {
      nodes.push(node);
    }
    if (node.children) {
      node.children.forEach(child => {
        nodes = nodes.concat(getAllNodes(child, excludeId));
      });
    }
    return nodes;
  };

  const getAlignmentGuides = (draggedNode: FigmaNode, newX: number, newY: number) => {
    if (!template) return { x: [], y: [] };
    
    const allNodes = getAllNodes(template.structure, draggedNode.id);
    const guides = { x: [] as number[], y: [] as number[] };
    const threshold = 5;
    
    allNodes.forEach(node => {
      if (Math.abs(newX - node.x) < threshold) guides.x.push(node.x);
      if (Math.abs(newX + draggedNode.width - (node.x + node.width)) < threshold) guides.x.push(node.x + node.width);
      if (Math.abs(newY - node.y) < threshold) guides.y.push(node.y);
      if (Math.abs(newY + draggedNode.height - (node.y + node.height)) < threshold) guides.y.push(node.y + node.height);
    });
    
    return guides;
  };

  const snapToGuides = (newX: number, newY: number, guides: {x: number[], y: number[]}) => {
    const threshold = 5;
    let snappedX = newX;
    let snappedY = newY;
    
    guides.x.forEach(guideX => {
      if (Math.abs(newX - guideX) < threshold) snappedX = guideX;
    });
    
    guides.y.forEach(guideY => {
      if (Math.abs(newY - guideY) < threshold) snappedY = guideY;
    });
    
    return { x: snappedX, y: snappedY };
  };

  const updateNodePosition = (nodeId: string, newX: number, newY: number) => {
    if (!template) return;
    
    const updatePosition = (node: FigmaNode): FigmaNode => {
      if (node.id === nodeId) {
        return { ...node, x: newX, y: newY };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(updatePosition)
        };
      }
      return node;
    };
    
    setTemplate(prev => prev ? {
      ...prev,
      structure: updatePosition(prev.structure)
    } : null);
  };

  const updateNodeSize = (nodeId: string, newWidth: number, newHeight: number, newFontSize?: number) => {
    if (!template) return;
    
    const updateSize = (node: FigmaNode): FigmaNode => {
      if (node.id === nodeId) {
        return { 
          ...node, 
          width: newWidth, 
          height: newHeight,
          ...(newFontSize && { fontSize: newFontSize })
        };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(updateSize)
        };
      }
      return node;
    };
    
    setTemplate(prev => prev ? {
      ...prev,
      structure: updateSize(prev.structure)
    } : null);
  };





  const renderNode = (node: FigmaNode): React.ReactNode => {
    if (!node) return null;

    // Handle TEXT nodes
    if (node.type === 'TEXT') {
      const textContent = editableNodes.get(node.id) || node.characters || node.text || '';
      const isSelected = selectedNodeId === node.id;
      
      return (
        <div key={node.id} style={{ position: 'relative' }}>
          <div
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
              cursor: 'text',
              border: isSelected ? '1px solid #FF6B35' : 'none',
              boxSizing: 'border-box',
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedNodeId(node.id);
            }}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateText(node.id, e.currentTarget.textContent || '')}
          >
            {textContent}
          </div>
          {isSelected && (
            <>
              {/* Drag Handle */}
              <div
                style={{
                  position: 'absolute',
                  left: `${node.x - 25}px`,
                  top: `${node.y + 2}px`,
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#FF6B35',
                  borderRadius: '4px',
                  cursor: 'move',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: 'white',
                  zIndex: 1000,
                }}
                title="Drag to move field"
                onMouseDown={(e) => {
                  e.preventDefault();
                  const rect = e.currentTarget.getBoundingClientRect();
                  setDragOffset({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                  });
                  
                  const handleMouseMove = (moveEvent: MouseEvent) => {
                    const container = document.querySelector('[data-resume-container]') as HTMLElement;
                    if (container) {
                      const containerRect = container.getBoundingClientRect();
                      const newX = moveEvent.clientX - containerRect.left - dragOffset.x;
                      const newY = moveEvent.clientY - containerRect.top - dragOffset.y;
                      
                      const guides = getAlignmentGuides(node, newX, newY);
                      const snapped = snapToGuides(newX, newY, guides);
                      
                      const boundedX = Math.max(0, Math.min(snapped.x, template?.width || 800 - node.width));
                      const boundedY = Math.max(0, Math.min(snapped.y, template?.height || 1000 - node.height));
                      
                      setAlignmentGuides(guides);
                      updateNodePosition(node.id, boundedX, boundedY);
                    }
                  };
                  
                  const handleMouseUp = () => {
                    setAlignmentGuides({ x: [], y: [] });
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };
                  
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              >
                ⋮⋮
              </div>
              
              {/* MS Word Style Resize Handles */}
              {/* Corner Handles */}
              {[{dir: 'nw', x: -4, y: -4, cursor: 'nw-resize'}, 
                {dir: 'ne', x: node.width-4, y: -4, cursor: 'ne-resize'},
                {dir: 'sw', x: -4, y: node.height-4, cursor: 'sw-resize'},
                {dir: 'se', x: node.width-4, y: node.height-4, cursor: 'se-resize'}].map(handle => (
                <div key={handle.dir}
                  style={{
                    position: 'absolute',
                    left: `${node.x + handle.x}px`,
                    top: `${node.y + handle.y}px`,
                    width: '8px', height: '8px',
                    backgroundColor: '#FF6B35', border: '1px solid #fff',
                    borderRadius: '2px', cursor: handle.cursor, zIndex: 1001,
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const [startX, startY, startW, startH, startFS] = [e.clientX, e.clientY, node.width, node.height, node.fontSize || 12];
                    const handleMouseMove = (me: MouseEvent) => {
                      const [dx, dy] = [me.clientX - startX, me.clientY - startY];
                      let [newW, newH, newX, newY] = [startW, startH, node.x, node.y];
                      if (handle.dir === 'se') { newW = Math.max(50, startW + dx); newH = Math.max(20, startH + dy); }
                      else if (handle.dir === 'sw') { newW = Math.max(50, startW - dx); newH = Math.max(20, startH + dy); newX = node.x + (startW - newW); }
                      else if (handle.dir === 'ne') { newW = Math.max(50, startW + dx); newH = Math.max(20, startH - dy); newY = node.y + (startH - newH); }
                      else if (handle.dir === 'nw') { newW = Math.max(50, startW - dx); newH = Math.max(20, startH - dy); newX = node.x + (startW - newW); newY = node.y + (startH - newH); }
                      const scaleFactor = Math.min(newW / startW, newH / startH);
                      const newFS = Math.max(8, Math.min(72, startFS * scaleFactor));
                      if (newX !== node.x || newY !== node.y) updateNodePosition(node.id, newX, newY);
                      updateNodeSize(node.id, newW, newH, newFS);
                    };
                    const handleMouseUp = () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp); };
                    document.addEventListener('mousemove', handleMouseMove); document.addEventListener('mouseup', handleMouseUp);
                  }}
                />
              ))}
              {/* Edge Handles */}
              {[{dir: 'n', x: node.width/2-4, y: -4, cursor: 'n-resize'},
                {dir: 's', x: node.width/2-4, y: node.height-4, cursor: 's-resize'},
                {dir: 'w', x: -4, y: node.height/2-4, cursor: 'w-resize'},
                {dir: 'e', x: node.width-4, y: node.height/2-4, cursor: 'e-resize'}].map(handle => (
                <div key={handle.dir}
                  style={{
                    position: 'absolute',
                    left: `${node.x + handle.x}px`,
                    top: `${node.y + handle.y}px`,
                    width: '8px', height: '8px',
                    backgroundColor: '#FF6B35', border: '1px solid #fff',
                    borderRadius: '1px', cursor: handle.cursor, zIndex: 1001,
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const [startX, startY, startW, startH, startFS] = [e.clientX, e.clientY, node.width, node.height, node.fontSize || 12];
                    const handleMouseMove = (me: MouseEvent) => {
                      const [dx, dy] = [me.clientX - startX, me.clientY - startY];
                      let [newW, newH, newX, newY] = [startW, startH, node.x, node.y];
                      if (handle.dir === 'n') { newH = Math.max(20, startH - dy); newY = node.y + (startH - newH); }
                      else if (handle.dir === 's') { newH = Math.max(20, startH + dy); }
                      else if (handle.dir === 'w') { newW = Math.max(50, startW - dx); newX = node.x + (startW - newW); }
                      else if (handle.dir === 'e') { newW = Math.max(50, startW + dx); }
                      const scaleFactor = Math.min(newW / startW, newH / startH);
                      const newFS = Math.max(8, Math.min(72, startFS * scaleFactor));
                      if (newX !== node.x || newY !== node.y) updateNodePosition(node.id, newX, newY);
                      updateNodeSize(node.id, newW, newH, newFS);
                    };
                    const handleMouseUp = () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp); };
                    document.addEventListener('mousemove', handleMouseMove); document.addEventListener('mouseup', handleMouseUp);
                  }}
                />
              ))}
            </>
          )}
        </div>
      );
    }

    // Handle RECTANGLE and IMAGE nodes
    if (node.type === 'RECTANGLE' || node.type === 'IMAGE') {
      const isSelected = selectedNodeId === node.id;
      
      return (
        <div key={node.id} style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              left: `${node.x}px`,
              top: `${node.y}px`,
              width: `${node.width}px`,
              height: `${node.height}px`,
              backgroundColor: getFillColor(node.fills),
              border: isSelected ? '2px solid #FF6B35' : 'none',
              boxSizing: 'border-box',
              cursor: 'pointer',
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedNodeId(node.id);
            }}
          />
          {isSelected && (
            <>
              {/* Drag Handle */}
              <div
                style={{
                  position: 'absolute',
                  left: `${node.x - 25}px`,
                  top: `${node.y + 2}px`,
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#FF6B35',
                  borderRadius: '4px',
                  cursor: 'move',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: 'white',
                  zIndex: 1000,
                }}
                title="Drag to move"
                onMouseDown={(e) => {
                  e.preventDefault();
                  const rect = e.currentTarget.getBoundingClientRect();
                  setDragOffset({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                  });
                  
                  const handleMouseMove = (moveEvent: MouseEvent) => {
                    const container = document.querySelector('[data-resume-container]') as HTMLElement;
                    if (container) {
                      const containerRect = container.getBoundingClientRect();
                      const newX = moveEvent.clientX - containerRect.left - dragOffset.x;
                      const newY = moveEvent.clientY - containerRect.top - dragOffset.y;
                      
                      const boundedX = Math.max(0, Math.min(newX, template?.width || 800 - node.width));
                      const boundedY = Math.max(0, Math.min(newY, template?.height || 1000 - node.height));
                      
                      updateNodePosition(node.id, boundedX, boundedY);
                    }
                  };
                  
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };
                  
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              >
                ⋮⋮
              </div>
              
              {/* MS Word Style Resize Handles */}
              {/* Corner Handles */}
              {[{dir: 'nw', x: -4, y: -4, cursor: 'nw-resize'}, 
                {dir: 'ne', x: node.width-4, y: -4, cursor: 'ne-resize'},
                {dir: 'sw', x: -4, y: node.height-4, cursor: 'sw-resize'},
                {dir: 'se', x: node.width-4, y: node.height-4, cursor: 'se-resize'}].map(handle => (
                <div key={handle.dir}
                  style={{
                    position: 'absolute',
                    left: `${node.x + handle.x}px`,
                    top: `${node.y + handle.y}px`,
                    width: '8px', height: '8px',
                    backgroundColor: '#FF6B35', border: '1px solid #fff',
                    borderRadius: '2px', cursor: handle.cursor, zIndex: 1001,
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const [startX, startY, startW, startH] = [e.clientX, e.clientY, node.width, node.height];
                    const handleMouseMove = (me: MouseEvent) => {
                      const [dx, dy] = [me.clientX - startX, me.clientY - startY];
                      let [newW, newH, newX, newY] = [startW, startH, node.x, node.y];
                      if (handle.dir === 'se') { newW = Math.max(20, startW + dx); newH = Math.max(20, startH + dy); }
                      else if (handle.dir === 'sw') { newW = Math.max(20, startW - dx); newH = Math.max(20, startH + dy); newX = node.x + (startW - newW); }
                      else if (handle.dir === 'ne') { newW = Math.max(20, startW + dx); newH = Math.max(20, startH - dy); newY = node.y + (startH - newH); }
                      else if (handle.dir === 'nw') { newW = Math.max(20, startW - dx); newH = Math.max(20, startH - dy); newX = node.x + (startW - newW); newY = node.y + (startH - newH); }
                      if (newX !== node.x || newY !== node.y) updateNodePosition(node.id, newX, newY);
                      updateNodeSize(node.id, newW, newH);
                    };
                    const handleMouseUp = () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp); };
                    document.addEventListener('mousemove', handleMouseMove); document.addEventListener('mouseup', handleMouseUp);
                  }}
                />
              ))}
              {/* Edge Handles */}
              {[{dir: 'n', x: node.width/2-4, y: -4, cursor: 'n-resize'},
                {dir: 's', x: node.width/2-4, y: node.height-4, cursor: 's-resize'},
                {dir: 'w', x: -4, y: node.height/2-4, cursor: 'w-resize'},
                {dir: 'e', x: node.width-4, y: node.height/2-4, cursor: 'e-resize'}].map(handle => (
                <div key={handle.dir}
                  style={{
                    position: 'absolute',
                    left: `${node.x + handle.x}px`,
                    top: `${node.y + handle.y}px`,
                    width: '8px', height: '8px',
                    backgroundColor: '#FF6B35', border: '1px solid #fff',
                    borderRadius: '1px', cursor: handle.cursor, zIndex: 1001,
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const [startX, startY, startW, startH] = [e.clientX, e.clientY, node.width, node.height];
                    const handleMouseMove = (me: MouseEvent) => {
                      const [dx, dy] = [me.clientX - startX, me.clientY - startY];
                      let [newW, newH, newX, newY] = [startW, startH, node.x, node.y];
                      if (handle.dir === 'n') { newH = Math.max(20, startH - dy); newY = node.y + (startH - newH); }
                      else if (handle.dir === 's') { newH = Math.max(20, startH + dy); }
                      else if (handle.dir === 'w') { newW = Math.max(20, startW - dx); newX = node.x + (startW - newW); }
                      else if (handle.dir === 'e') { newW = Math.max(20, startW + dx); }
                      if (newX !== node.x || newY !== node.y) updateNodePosition(node.id, newX, newY);
                      updateNodeSize(node.id, newW, newH);
                    };
                    const handleMouseUp = () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp); };
                    document.addEventListener('mousemove', handleMouseMove); document.addEventListener('mouseup', handleMouseUp);
                  }}
                />
              ))}
            </>
          )}
        </div>
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
          <p className="text-gray-600">Loading your resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left Panel - AI Chat / Minimized */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${
        editMode === 'manual' ? 'w-16' : 'w-96'
      } flex flex-col`}>
        {/* Mode Toggle Header */}
        <div className="p-4 border-b bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="flex items-center justify-between">
            {editMode === 'ai' ? (
              <>
                <h2 className="font-semibold">AI Enhancement</h2>
                <button
                  onClick={() => setEditMode('manual')}
                  className="px-3 py-1 bg-white/20 rounded text-sm hover:bg-white/30"
                >
                  Manual Edit
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setEditMode('ai')}
                  className="p-2 bg-white/20 rounded hover:bg-white/30 mb-2"
                  title="AI Enhancement Mode"
                >
                  🤖
                </button>
                <button
                  onClick={() => navigate('/resume-builder')}
                  className="p-2 bg-white/20 rounded hover:bg-white/30"
                  title="Back"
                >
                  ←
                </button>
              </div>
            )}
          </div>
        </div>

        {/* AI Chat Panel */}
        {editMode === 'ai' && (
          <>
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  <div className="text-4xl mb-4">🤖</div>
                  <p className="text-sm">Ask me to enhance your resume!</p>
                  <div className="mt-4 space-y-2 text-xs text-left bg-gray-50 p-3 rounded">
                    <p><strong>Try:</strong></p>
                    <p>• "Make my resume ATS friendly"</p>
                    <p>• "Improve my skills section"</p>
                    <p>• "Add more impact to experience"</p>
                    <p>• "Optimize for software engineer role"</p>
                  </div>
                </div>
              )}
              
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              
              {isAiProcessing && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                      <span className="text-sm text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={currentPrompt}
                  onChange={(e) => setCurrentPrompt(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendAiPrompt(currentPrompt)}
                  placeholder="Ask AI to enhance your resume..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={isAiProcessing}
                />
                <button
                  onClick={() => sendAiPrompt(currentPrompt)}
                  disabled={isAiProcessing || !currentPrompt.trim()}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Right Panel - Resume Editor */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {editMode === 'ai' && (
              <button
                onClick={() => navigate('/resume-builder')}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                ← Back
              </button>
            )}
            <button
              onClick={() => navigate('/templates')}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded hover:from-orange-600 hover:to-red-600"
            >
              Change Template
            </button>
          </div>
          
          <h1 className="text-xl font-bold text-gray-800">
            {resumeData ? `${resumeData.enhancedData?.basicInfo?.fullName || 'My Resume'} - ${template.name}` : template.name}
          </h1>
          
          <button
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => alert('Save functionality coming soon!')}
          >
            Save Resume
          </button>
        </div>

        {/* Resume Canvas */}
        <div className="flex-1 bg-gray-50 p-8 overflow-auto flex justify-center items-start">
          <div
            data-resume-container
            style={{
              position: 'relative',
              width: `${template.width}px`,
              height: `${template.height}px`,
              backgroundColor: template.backgroundColor || '#fff',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              borderRadius: '8px',
            }}
            onClick={() => setSelectedNodeId(null)}
          >
            {template.structure && renderNode(template.structure)}
            
            {/* Alignment Guides */}
            {alignmentGuides.x.map((x, i) => (
              <div
                key={`guide-x-${i}`}
                style={{
                  position: 'absolute',
                  left: `${x}px`,
                  top: '0px',
                  width: '1px',
                  height: '100%',
                  backgroundColor: '#FF6B35',
                  pointerEvents: 'none',
                  zIndex: 999,
                }}
              />
            ))}
            {alignmentGuides.y.map((y, i) => (
              <div
                key={`guide-y-${i}`}
                style={{
                  position: 'absolute',
                  left: '0px',
                  top: `${y}px`,
                  width: '100%',
                  height: '1px',
                  backgroundColor: '#FF6B35',
                  pointerEvents: 'none',
                  zIndex: 999,
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom Help Text */}
        <div className="bg-white border-t p-3 text-center text-sm text-gray-600">
          {editMode === 'ai' ? (
            'Use AI chat to enhance your resume • Changes appear live on the right'
          ) : (
            'Click to select • Drag orange handle to move • Drag corners/edges to resize • Edit text directly'
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
