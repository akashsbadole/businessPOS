import React, { useState, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Card, CardBody, Button, Tabs, Tab } from '@heroui/react';
import { Icon } from '@iconify/react';
import { InvoiceElement, InvoiceTemplate, DragItem } from '../../types/invoice-template';
import { ElementToolbox } from './element-toolbox';
import { CanvasArea } from './canvas-area';
import { PropertiesPanel } from './properties-panel';
import { TemplatePreview } from './template-preview';
import { useAuth } from '../../contexts/auth-context';

interface InvoiceBuilderProps {
  template?: InvoiceTemplate;
  onSave: (template: InvoiceTemplate) => void;
  onCancel: () => void;
}

export const InvoiceBuilder: React.FC<InvoiceBuilderProps> = ({
  template,
  onSave,
  onCancel,
}) => {
  const { hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('design');
  const [selectedElement, setSelectedElement] = useState<InvoiceElement | null>(null);
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  
  const [currentTemplate, setCurrentTemplate] = useState<InvoiceTemplate>(
    template || {
      id: '',
      name: 'New Template',
      category: 'invoice',
      paperSize: 'A4',
      orientation: 'portrait',
      dimensions: { width: 210, height: 297, unit: 'mm' },
      margins: { top: 20, right: 20, bottom: 20, left: 20 },
      elements: [],
      isDefault: false,
      isActive: true,
      createdBy: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
    }
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const dragItem = active.data.current as DragItem;
    setDraggedItem(dragItem);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && over.id === 'canvas') {
      const dragItem = active.data.current as DragItem;
      const rect = (over.rect as any);
      
      // Calculate position relative to canvas
      const x = event.delta.x;
      const y = event.delta.y;
      
      // Create new element
      const newElement: InvoiceElement = {
        id: `element_${Date.now()}`,
        type: dragItem.type,
        x: Math.max(0, x),
        y: Math.max(0, y),
        width: dragItem.defaultProps.width || 100,
        height: dragItem.defaultProps.height || 30,
        content: dragItem.defaultProps.content || '',
        styles: dragItem.defaultProps.styles || {},
        properties: dragItem.defaultProps.properties || {},
        locked: false,
        visible: true,
      };

      setCurrentTemplate(prev => ({
        ...prev,
        elements: [...prev.elements, newElement],
        updatedAt: new Date(),
      }));
    }
    
    setDraggedItem(null);
  }, []);

  const handleElementUpdate = useCallback((elementId: string, updates: Partial<InvoiceElement>) => {
    setCurrentTemplate(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === elementId ? { ...el, ...updates } : el
      ),
      updatedAt: new Date(),
    }));
  }, []);

  const handleElementDelete = useCallback((elementId: string) => {
    setCurrentTemplate(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== elementId),
      updatedAt: new Date(),
    }));
    
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
  }, [selectedElement]);

  const handleTemplateUpdate = useCallback((updates: Partial<InvoiceTemplate>) => {
    setCurrentTemplate(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date(),
    }));
  }, []);

  const handleSave = () => {
    onSave(currentTemplate);
  };

  if (!hasPermission('invoice_templates')) {
    return (
      <Card className="m-4">
        <CardBody className="text-center py-8">
          <Icon icon="lucide:lock" className="text-4xl text-default-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-default-600">
            You don't have permission to access the invoice template builder.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-content1">
      {/* Header */}
      <div className="border-b border-divider p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="light"
            isIconOnly
            onPress={onCancel}
          >
            <Icon icon="lucide:arrow-left" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{currentTemplate.name}</h1>
            <p className="text-sm text-default-600">
              {currentTemplate.category} • {currentTemplate.paperSize} • {currentTemplate.orientation}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="bordered" onPress={() => setActiveTab('preview')}>
            <Icon icon="lucide:eye" />
            Preview
          </Button>
          <Button color="primary" onPress={handleSave}>
            <Icon icon="lucide:save" />
            Save Template
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* Left Sidebar - Toolbox */}
          <div className="w-64 border-r border-divider bg-content2">
            <Tabs
              selectedKey={activeTab}
              onSelectionChange={(key) => setActiveTab(key as string)}
              className="h-full"
            >
              <Tab key="design" title="Design">
                <ElementToolbox />
              </Tab>
              <Tab key="properties" title="Properties">
                <PropertiesPanel
                  element={selectedElement}
                  template={currentTemplate}
                  onElementUpdate={handleElementUpdate}
                  onTemplateUpdate={handleTemplateUpdate}
                />
              </Tab>
            </Tabs>
          </div>

          {/* Center - Canvas */}
          <div className="flex-1 overflow-auto bg-default-50">
            {activeTab === 'preview' ? (
              <TemplatePreview template={currentTemplate} />
            ) : (
              <CanvasArea
                template={currentTemplate}
                selectedElement={selectedElement}
                onElementSelect={setSelectedElement}
                onElementUpdate={handleElementUpdate}
                onElementDelete={handleElementDelete}
              />
            )}
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {draggedItem ? (
              <div className="bg-primary text-primary-foreground px-3 py-2 rounded-lg shadow-lg">
                <Icon icon={draggedItem.icon} className="inline mr-2" />
                {draggedItem.name}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};
