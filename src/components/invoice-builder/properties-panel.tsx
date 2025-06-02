import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Slider,
  Switch,
  Button,
  Divider,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { InvoiceElement, InvoiceTemplate } from '../../types/invoice-template';

interface PropertiesPanelProps {
  element: InvoiceElement | null;
  template: InvoiceTemplate;
  onElementUpdate: (elementId: string, updates: Partial<InvoiceElement>) => void;
  onTemplateUpdate: (updates: Partial<InvoiceTemplate>) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  element,
  template,
  onElementUpdate,
  onTemplateUpdate,
}) => {
  const handleElementStyleUpdate = (styleUpdates: any) => {
    if (!element) return;
    
    onElementUpdate(element.id, {
      styles: {
        ...element.styles,
        ...styleUpdates,
      },
    });
  };

  const handleElementPropertyUpdate = (propertyUpdates: any) => {
    if (!element) return;
    
    onElementUpdate(element.id, {
      properties: {
        ...element.properties,
        ...propertyUpdates,
      },
    });
  };

  const renderElementProperties = () => {
    if (!element) {
      return (
        <div className="text-center py-8 text-default-500">
          <Icon icon="lucide:mouse-pointer-click" className="text-3xl mb-2" />
          <p>Select an element to edit its properties</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Basic Properties */}
        <Card>
          <CardHeader className="pb-2">
            <h4 className="text-sm font-semibold">Position & Size</h4>
          </CardHeader>
          <CardBody className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="X"
                size="sm"
                type="number"
                value={element.x.toString()}
                onValueChange={(value) =>
                  onElementUpdate(element.id, { x: parseFloat(value) || 0 })
                }
              />
              <Input
                label="Y"
                size="sm"
                type="number"
                value={element.y.toString()}
                onValueChange={(value) =>
                  onElementUpdate(element.id, { y: parseFloat(value) || 0 })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Width"
                size="sm"
                type="number"
                value={element.width.toString()}
                onValueChange={(value) =>
                  onElementUpdate(element.id, { width: parseFloat(value) || 1 })
                }
              />
              <Input
                label="Height"
                size="sm"
                type="number"
                value={element.height.toString()}
                onValueChange={(value) =>
                  onElementUpdate(element.id, { height: parseFloat(value) || 1 })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                size="sm"
                isSelected={element.visible !== false}
                onValueChange={(visible) =>
                  onElementUpdate(element.id, { visible })
                }
              >
                Visible
              </Switch>
              <Switch
                size="sm"
                isSelected={element.locked === true}
                onValueChange={(locked) =>
                  onElementUpdate(element.id, { locked })
                }
              >
                Locked
              </Switch>
            </div>
          </CardBody>
        </Card>

        {/* Content Properties */}
        {(element.type === 'text' || element.type === 'footer') && (
          <Card>
            <CardHeader className="pb-2">
              <h4 className="text-sm font-semibold">Content</h4>
            </CardHeader>
            <CardBody className="space-y-3">
              <Input
                label="Text"
                size="sm"
                value={element.content || ''}
                onValueChange={(content) =>
                  onElementUpdate(element.id, { content })
                }
              />
            </CardBody>
          </Card>
        )}

        {/* Style Properties */}
        <Card>
          <CardHeader className="pb-2">
            <h4 className="text-sm font-semibold">Styling</h4>
          </CardHeader>
          <CardBody className="space-y-3">
            {/* Font Size */}
            {['text', 'business-info', 'customer-info', 'totals', 'footer'].includes(element.type) && (
              <div>
                <label className="text-xs text-default-600 mb-1 block">
                  Font Size: {element.styles?.fontSize || 12}px
                </label>
                <Slider
                  size="sm"
                  step={1}
                  minValue={8}
                  maxValue={48}
                  value={element.styles?.fontSize || 12}
                  onChange={(value) =>
                    handleElementStyleUpdate({ fontSize: Array.isArray(value) ? value[0] : value })
                  }
                />
              </div>
            )}

            {/* Font Weight */}
            {['text', 'business-info', 'customer-info', 'totals', 'footer'].includes(element.type) && (
              <Select
                label="Font Weight"
                size="sm"
                selectedKeys={[element.styles?.fontWeight || 'normal']}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  handleElementStyleUpdate({ fontWeight: value });
                }}
              >
                <SelectItem key="normal">Normal</SelectItem>
                <SelectItem key="bold">Bold</SelectItem>
              </Select>
            )}

            {/* Text Align */}
            {['text', 'business-info', 'customer-info', 'totals', 'footer'].includes(element.type) && (
              <Select
                label="Text Align"
                size="sm"
                selectedKeys={[element.styles?.textAlign || 'left']}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  handleElementStyleUpdate({ textAlign: value });
                }}
              >
                <SelectItem key="left">Left</SelectItem>
                <SelectItem key="center">Center</SelectItem>
                <SelectItem key="right">Right</SelectItem>
              </Select>
            )}

            {/* Color */}
            <Input
              label="Color"
              size="sm"
              type="color"
              value={element.styles?.color || '#000000'}
              onValueChange={(color) =>
                handleElementStyleUpdate({ color })
              }
            />

            {/* Background Color */}
            {element.type === 'line' && (
              <Input
                label="Background Color"
                size="sm"
                type="color"
                value={element.styles?.backgroundColor || '#000000'}
                onValueChange={(backgroundColor) =>
                  handleElementStyleUpdate({ backgroundColor })
                }
              />
            )}

            {/* Border */}
            {['items-table'].includes(element.type) && (
              <>
                <div>
                  <label className="text-xs text-default-600 mb-1 block">
                    Border Width: {element.styles?.borderWidth || 1}px
                  </label>
                  <Slider
                    size="sm"
                    step={1}
                    minValue={0}
                    maxValue={5}
                    value={element.styles?.borderWidth || 1}
                    onChange={(value) =>
                      handleElementStyleUpdate({ borderWidth: Array.isArray(value) ? value[0] : value })
                    }
                  />
                </div>
                <Input
                  label="Border Color"
                  size="sm"
                  type="color"
                  value={element.styles?.borderColor || '#000000'}
                  onValueChange={(borderColor) =>
                    handleElementStyleUpdate({ borderColor })
                  }
                />
              </>
            )}
          </CardBody>
        </Card>

        {/* Element-specific Properties */}
        {element.type === 'qr-code' && (
          <Card>
            <CardHeader className="pb-2">
              <h4 className="text-sm font-semibold">QR Code</h4>
            </CardHeader>
            <CardBody>
              <Input
                label="Data"
                size="sm"
                value={element.properties?.data || ''}
                onValueChange={(data) =>
                  handleElementPropertyUpdate({ data })
                }
              />
            </CardBody>
          </Card>
        )}

        {element.type === 'barcode' && (
          <Card>
            <CardHeader className="pb-2">
              <h4 className="text-sm font-semibold">Barcode</h4>
            </CardHeader>
            <CardBody className="space-y-3">
              <Input
                label="Data"
                size="sm"
                value={element.properties?.data || ''}
                onValueChange={(data) =>
                  handleElementPropertyUpdate({ data })
                }
              />
              <Select
                label="Format"
                size="sm"
                selectedKeys={[element.properties?.format || 'CODE128']}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  handleElementPropertyUpdate({ format: value });
                }}
              >
                <SelectItem key="CODE128">CODE128</SelectItem>
                <SelectItem key="CODE39">CODE39</SelectItem>
                <SelectItem key="EAN13">EAN13</SelectItem>
                <SelectItem key="UPC">UPC</SelectItem>
              </Select>
            </CardBody>
          </Card>
        )}
      </div>
    );
  };

  const renderTemplateProperties = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <h4 className="text-sm font-semibold">Template Settings</h4>
        </CardHeader>
        <CardBody className="space-y-3">
          <Input
            label="Template Name"
            size="sm"
            value={template.name}
            onValueChange={(name) => onTemplateUpdate({ name })}
          />
          
          <Select
            label="Category"
            size="sm"
            selectedKeys={[template.category]}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              onTemplateUpdate({ category: value as any });
            }}
          >
            <SelectItem key="receipt">Receipt</SelectItem>
            <SelectItem key="invoice">Invoice</SelectItem>
            <SelectItem key="estimate">Estimate</SelectItem>
            <SelectItem key="custom">Custom</SelectItem>
          </Select>

          <Select
            label="Paper Size"
            size="sm"
            selectedKeys={[template.paperSize]}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              onTemplateUpdate({ paperSize: value as any });
            }}
          >
            <SelectItem key="A4">A4</SelectItem>
            <SelectItem key="A5">A5</SelectItem>
            <SelectItem key="thermal-80mm">Thermal 80mm</SelectItem>
            <SelectItem key="thermal-58mm">Thermal 58mm</SelectItem>
          </Select>

          <Select
            label="Orientation"
            size="sm"
            selectedKeys={[template.orientation]}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              onTemplateUpdate({ orientation: value as any });
            }}
          >
            <SelectItem key="portrait">Portrait</SelectItem>
            <SelectItem key="landscape">Landscape</SelectItem>
          </Select>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <h4 className="text-sm font-semibold">Margins</h4>
        </CardHeader>
        <CardBody className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Top"
              size="sm"
              type="number"
              value={template.margins.top.toString()}
              onValueChange={(value) =>
                onTemplateUpdate({
                  margins: { ...template.margins, top: parseFloat(value) || 0 }
                })
              }
            />
            <Input
              label="Right"
              size="sm"
              type="number"
              value={template.margins.right.toString()}
              onValueChange={(value) =>
                onTemplateUpdate({
                  margins: { ...template.margins, right: parseFloat(value) || 0 }
                })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Bottom"
              size="sm"
              type="number"
              value={template.margins.bottom.toString()}
              onValueChange={(value) =>
                onTemplateUpdate({
                  margins: { ...template.margins, bottom: parseFloat(value) || 0 }
                })
              }
            />
            <Input
              label="Left"
              size="sm"
              type="number"
              value={template.margins.left.toString()}
              onValueChange={(value) =>
                onTemplateUpdate({
                  margins: { ...template.margins, left: parseFloat(value) || 0 }
                })
              }
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );

  return (
    <div className="p-4 h-full overflow-y-auto">
      {element ? renderElementProperties() : renderTemplateProperties()}
    </div>
  );
};
