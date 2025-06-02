import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Card, CardBody, CardHeader } from '@heroui/react';
import { Icon } from '@iconify/react';
import { DragItem } from '../../types/invoice-template';

const elementTypes: DragItem[] = [
  {
    id: 'text',
    type: 'text',
    name: 'Text',
    icon: 'lucide:type',
    defaultProps: {
      width: 200,
      height: 30,
      content: 'Sample Text',
      styles: {
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'left',
        color: '#000000',
      },
    },
  },
  {
    id: 'business-info',
    type: 'business-info',
    name: 'Business Info',
    icon: 'lucide:building',
    defaultProps: {
      width: 250,
      height: 120,
      properties: {
        fields: ['name', 'address', 'phone', 'email', 'gstin'],
      },
      styles: {
        fontSize: 12,
        textAlign: 'left',
      },
    },
  },
  {
    id: 'customer-info',
    type: 'customer-info',
    name: 'Customer Info',
    icon: 'lucide:user',
    defaultProps: {
      width: 250,
      height: 100,
      properties: {
        fields: ['name', 'address', 'phone', 'gstin'],
      },
      styles: {
        fontSize: 12,
        textAlign: 'left',
      },
    },
  },
  {
    id: 'items-table',
    type: 'items-table',
    name: 'Items Table',
    icon: 'lucide:table',
    defaultProps: {
      width: 500,
      height: 200,
      properties: {
        columns: ['Item', 'Qty', 'Rate', 'Amount'],
      },
      styles: {
        fontSize: 11,
        borderWidth: 1,
        borderColor: '#000000',
      },
    },
  },
  {
    id: 'totals',
    type: 'totals',
    name: 'Totals',
    icon: 'lucide:calculator',
    defaultProps: {
      width: 200,
      height: 100,
      properties: {
        fields: ['subtotal', 'tax', 'discount', 'total'],
      },
      styles: {
        fontSize: 12,
        textAlign: 'right',
      },
    },
  },
  {
    id: 'image',
    type: 'image',
    name: 'Image/Logo',
    icon: 'lucide:image',
    defaultProps: {
      width: 100,
      height: 100,
      properties: {
        alt: 'Logo',
      },
    },
  },
  {
    id: 'line',
    type: 'line',
    name: 'Line',
    icon: 'lucide:minus',
    defaultProps: {
      width: 300,
      height: 2,
      styles: {
        backgroundColor: '#000000',
      },
    },
  },
  {
    id: 'qr-code',
    type: 'qr-code',
    name: 'QR Code',
    icon: 'lucide:qr-code',
    defaultProps: {
      width: 80,
      height: 80,
      properties: {
        data: 'Invoice QR Code',
      },
    },
  },
  {
    id: 'barcode',
    type: 'barcode',
    name: 'Barcode',
    icon: 'lucide:scan-line',
    defaultProps: {
      width: 150,
      height: 40,
      properties: {
        data: '123456789',
        format: 'CODE128',
      },
    },
  },
  {
    id: 'footer',
    type: 'footer',
    name: 'Footer',
    icon: 'lucide:align-center',
    defaultProps: {
      width: 500,
      height: 60,
      content: 'Thank you for your business!',
      styles: {
        fontSize: 10,
        textAlign: 'center',
        color: '#666666',
      },
    },
  },
];

interface DraggableElementProps {
  item: DragItem;
}

const DraggableElement: React.FC<DraggableElementProps> = ({ item }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: item,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="mb-2 cursor-grab active:cursor-grabbing"
    >
      <Card className="hover:bg-content3 transition-colors">
        <CardBody className="p-3">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <Icon icon={item.icon} className="text-lg text-default-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.name}</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export const ElementToolbox: React.FC = () => {
  const basicElements = elementTypes.filter(item => 
    ['text', 'image', 'line'].includes(item.type)
  );
  
  const dataElements = elementTypes.filter(item => 
    ['business-info', 'customer-info', 'items-table', 'totals'].includes(item.type)
  );
  
  const specialElements = elementTypes.filter(item => 
    ['qr-code', 'barcode', 'footer'].includes(item.type)
  );

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="space-y-6">
        {/* Basic Elements */}
        <div>
          <h3 className="text-sm font-semibold text-default-700 mb-3">Basic Elements</h3>
          {basicElements.map((item) => (
            <DraggableElement key={item.id} item={item} />
          ))}
        </div>

        {/* Data Elements */}
        <div>
          <h3 className="text-sm font-semibold text-default-700 mb-3">Data Elements</h3>
          {dataElements.map((item) => (
            <DraggableElement key={item.id} item={item} />
          ))}
        </div>

        {/* Special Elements */}
        <div>
          <h3 className="text-sm font-semibold text-default-700 mb-3">Special Elements</h3>
          {specialElements.map((item) => (
            <DraggableElement key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};
