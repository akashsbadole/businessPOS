import React, { useRef, useState, useCallback } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Card } from '@heroui/react';
import { InvoiceElement, InvoiceTemplate } from '../../types/invoice-template';
import { DraggableInvoiceElement } from './draggable-invoice-element';

interface CanvasAreaProps {
  template: InvoiceTemplate;
  selectedElement: InvoiceElement | null;
  onElementSelect: (element: InvoiceElement | null) => void;
  onElementUpdate: (elementId: string, updates: Partial<InvoiceElement>) => void;
  onElementDelete: (elementId: string) => void;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  template,
  selectedElement,
  onElementSelect,
  onElementUpdate,
  onElementDelete,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const { setNodeRef } = useDroppable({
    id: 'canvas',
  });

  // Calculate canvas dimensions based on paper size
  const getCanvasDimensions = () => {
    const { paperSize, orientation, dimensions } = template;
    
    let width = dimensions.width;
    let height = dimensions.height;
    
    if (orientation === 'landscape') {
      [width, height] = [height, width];
    }
    
    // Convert to pixels (assuming 96 DPI)
    const scale = 2; // Scale factor for better visibility
    return {
      width: (width * 96 / 25.4) * scale, // mm to px
      height: (height * 96 / 25.4) * scale,
      scale,
    };
  };

  const canvasDimensions = getCanvasDimensions();

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onElementSelect(null);
    }
  }, [onElementSelect]);

  const handleElementDragStart = useCallback((elementId: string, offset: { x: number; y: number }) => {
    setIsDragging(true);
    setDragOffset(offset);
  }, []);

  const handleElementDrag = useCallback((elementId: string, position: { x: number; y: number }) => {
    const adjustedPosition = {
      x: Math.max(0, Math.min(position.x - dragOffset.x, canvasDimensions.width - 50)),
      y: Math.max(0, Math.min(position.y - dragOffset.y, canvasDimensions.height - 20)),
    };
    
    onElementUpdate(elementId, adjustedPosition);
  }, [dragOffset, canvasDimensions, onElementUpdate]);

  const handleElementDragEnd = useCallback(() => {
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const handleElementResize = useCallback((elementId: string, size: { width: number; height: number }) => {
    onElementUpdate(elementId, size);
  }, [onElementUpdate]);

  return (
    <div className="p-8 min-h-full flex items-center justify-center">
      <div className="relative">
        {/* Canvas */}
        <Card
          ref={(node) => {
            setNodeRef(node);
            if (canvasRef.current !== node) {
              canvasRef.current = node;
            }
          }}
          className="relative bg-white shadow-lg overflow-hidden"
          style={{
            width: canvasDimensions.width,
            height: canvasDimensions.height,
            minHeight: canvasDimensions.height,
          }}
          onClick={handleCanvasClick}
        >
          {/* Margins Guide */}
          <div
            className="absolute border border-dashed border-default-300 pointer-events-none"
            style={{
              top: template.margins.top * canvasDimensions.scale,
              left: template.margins.left * canvasDimensions.scale,
              right: template.margins.right * canvasDimensions.scale,
              bottom: template.margins.bottom * canvasDimensions.scale,
              width: canvasDimensions.width - (template.margins.left + template.margins.right) * canvasDimensions.scale,
              height: canvasDimensions.height - (template.margins.top + template.margins.bottom) * canvasDimensions.scale,
            }}
          />

          {/* Grid */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg width="100%" height="100%">
              <defs>
                <pattern
                  id="grid"
                  width={20 * canvasDimensions.scale}
                  height={20 * canvasDimensions.scale}
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d={`M ${20 * canvasDimensions.scale} 0 L 0 0 0 ${20 * canvasDimensions.scale}`}
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Elements */}
          {template.elements.map((element) => (
            <DraggableInvoiceElement
              key={element.id}
              element={element}
              isSelected={selectedElement?.id === element.id}
              scale={canvasDimensions.scale}
              onSelect={() => onElementSelect(element)}
              onUpdate={(updates) => onElementUpdate(element.id, updates)}
              onDelete={() => onElementDelete(element.id)}
              onDragStart={handleElementDragStart}
              onDrag={handleElementDrag}
              onDragEnd={handleElementDragEnd}
              onResize={handleElementResize}
            />
          ))}
        </Card>

        {/* Canvas Info */}
        <div className="absolute -bottom-8 left-0 text-xs text-default-500">
          {template.paperSize} • {template.orientation} • {canvasDimensions.width}×{canvasDimensions.height}px
        </div>
      </div>
    </div>
  );
};
