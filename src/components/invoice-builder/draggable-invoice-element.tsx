import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { InvoiceElement } from '../../types/invoice-template';

interface DraggableInvoiceElementProps {
  element: InvoiceElement;
  isSelected: boolean;
  scale: number;
  onSelect: () => void;
  onUpdate: (updates: Partial<InvoiceElement>) => void;
  onDelete: () => void;
  onDragStart: (elementId: string, offset: { x: number; y: number }) => void;
  onDrag: (elementId: string, position: { x: number; y: number }) => void;
  onDragEnd: () => void;
  onResize: (elementId: string, size: { width: number; height: number }) => void;
}

export const DraggableInvoiceElement: React.FC<DraggableInvoiceElementProps> = ({
  element,
  isSelected,
  scale,
  onSelect,
  onUpdate,
  onDelete,
  onDragStart,
  onDrag,
  onDragEnd,
  onResize,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target !== e.currentTarget && !e.currentTarget.contains(e.target as Node)) {
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    onSelect();
    
    const rect = elementRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const offset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    
    setDragStart({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
    onDragStart(element.id, offset);
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      onDrag(element.id, {
        x: element.x + deltaX / scale,
        y: element.y + deltaY / scale,
      });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      onDragEnd();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [element, scale, onSelect, onDragStart, onDrag, onDragEnd, dragStart]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = element.width;
    const startHeight = element.height;
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = (e.clientX - startX) / scale;
      const deltaY = (e.clientY - startY) / scale;
      
      let newWidth = startWidth;
      let newHeight = startHeight;
      
      if (direction.includes('right')) {
        newWidth = Math.max(20, startWidth + deltaX);
      }
      if (direction.includes('bottom')) {
        newHeight = Math.max(20, startHeight + deltaY);
      }
      
      onResize(element.id, { width: newWidth, height: newHeight });
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [element, scale, onResize]);

  const renderElementContent = () => {
    const { type, content, properties } = element;
    
    switch (type) {
      case 'text':
        return (
          <div
            className="w-full h-full flex items-center"
            style={{
              fontSize: (element.styles?.fontSize || 14) * scale,
              fontWeight: element.styles?.fontWeight || 'normal',
              textAlign: element.styles?.textAlign || 'left',
              color: element.styles?.color || '#000000',
            }}
          >
            {content || 'Text'}
          </div>
        );
        
      case 'business-info':
        return (
          <div
            className="w-full h-full text-xs"
            style={{
              fontSize: (element.styles?.fontSize || 12) * scale,
              color: element.styles?.color || '#000000',
            }}
          >
            <div className="font-semibold">Business Name</div>
            <div>123 Business Street</div>
            <div>City, State 12345</div>
            <div>Phone: (555) 123-4567</div>
            <div>Email: info@business.com</div>
          </div>
        );
        
      case 'customer-info':
        return (
          <div
            className="w-full h-full text-xs"
            style={{
              fontSize: (element.styles?.fontSize || 12) * scale,
              color: element.styles?.color || '#000000',
            }}
          >
            <div className="font-semibold">Customer Name</div>
            <div>456 Customer Ave</div>
            <div>City, State 67890</div>
            <div>Phone: (555) 987-6543</div>
          </div>
        );
        
      case 'items-table':
        return (
          <div className="w-full h-full border border-gray-300">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border-r border-gray-300 p-1">Item</th>
                  <th className="border-r border-gray-300 p-1">Qty</th>
                  <th className="border-r border-gray-300 p-1">Rate</th>
                  <th className="p-1">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-r border-gray-300 p-1">Sample Item</td>
                  <td className="border-r border-gray-300 p-1 text-center">1</td>
                  <td className="border-r border-gray-300 p-1 text-right">$100.00</td>
                  <td className="p-1 text-right">$100.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
        
      case 'totals':
        return (
          <div
            className="w-full h-full text-xs space-y-1"
            style={{
              fontSize: (element.styles?.fontSize || 12) * scale,
              textAlign: element.styles?.textAlign || 'right',
            }}
          >
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>$100.00</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>$10.00</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-1">
              <span>Total:</span>
              <span>$110.00</span>
            </div>
          </div>
        );
        
      case 'image':
        return (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Icon icon="lucide:image" className="text-gray-400" />
          </div>
        );
        
      case 'line':
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: element.styles?.backgroundColor || '#000000',
            }}
          />
        );
        
      case 'qr-code':
        return (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Icon icon="lucide:qr-code" className="text-gray-600" />
          </div>
        );
        
      case 'barcode':
        return (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Icon icon="lucide:scan-line" className="text-gray-600" />
          </div>
        );
        
      case 'footer':
        return (
          <div
            className="w-full h-full flex items-center justify-center text-xs"
            style={{
              fontSize: (element.styles?.fontSize || 10) * scale,
              textAlign: element.styles?.textAlign || 'center',
              color: element.styles?.color || '#666666',
            }}
          >
            {content || 'Footer text'}
          </div>
        );
        
      default:
        return <div className="w-full h-full bg-gray-100" />;
    }
  };

  return (
    <div
      ref={elementRef}
      className={`absolute cursor-move select-none ${
        isSelected ? 'ring-2 ring-primary' : ''
      } ${isDragging ? 'opacity-75' : ''}`}
      style={{
        left: element.x * scale,
        top: element.y * scale,
        width: element.width * scale,
        height: element.height * scale,
        zIndex: isSelected ? 10 : 1,
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Element Content */}
      <div className="w-full h-full overflow-hidden">
        {renderElementContent()}
      </div>
      
      {/* Selection Handles */}
      {isSelected && !element.locked && (
        <>
          {/* Delete Button */}
          <Button
            isIconOnly
            size="sm"
            color="danger"
            variant="solid"
            className="absolute -top-8 -right-2 z-20"
            onPress={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Icon icon="lucide:trash-2" width={12} height={12} />
          </Button>
          
          {/* Resize Handle */}
          <div
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary cursor-se-resize z-20"
            onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-right')}
          />
        </>
      )}
    </div>
  );
};
