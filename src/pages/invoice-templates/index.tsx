import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { InvoiceTemplate } from '../../types/invoice-template';
import { InvoiceBuilder } from '../../components/invoice-builder/invoice-builder';
import { useAuth } from '../../contexts/auth-context';

export const InvoiceTemplatesPage: React.FC = () => {
  const { hasPermission } = useAuth();
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingTemplate, setEditingTemplate] = useState<InvoiceTemplate | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [templateToDelete, setTemplateToDelete] = useState<InvoiceTemplate | null>(null);

  // Sample templates for demo
  useEffect(() => {
    const sampleTemplates: InvoiceTemplate[] = [
      {
        id: '1',
        name: 'Standard Invoice',
        description: 'Professional invoice template for general business use',
        category: 'invoice',
        paperSize: 'A4',
        orientation: 'portrait',
        dimensions: { width: 210, height: 297, unit: 'mm' },
        margins: { top: 20, right: 20, bottom: 20, left: 20 },
        elements: [],
        isDefault: true,
        isActive: true,
        createdBy: '1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        version: 1,
        tags: ['business', 'professional'],
      },
      {
        id: '2',
        name: 'Thermal Receipt',
        description: 'Compact receipt template for thermal printers',
        category: 'receipt',
        paperSize: 'thermal-80mm',
        orientation: 'portrait',
        dimensions: { width: 80, height: 200, unit: 'mm' },
        margins: { top: 5, right: 5, bottom: 5, left: 5 },
        elements: [],
        isDefault: false,
        isActive: true,
        createdBy: '1',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        version: 1,
        tags: ['receipt', 'thermal'],
      },
      {
        id: '3',
        name: 'Service Estimate',
        description: 'Template for service quotations and estimates',
        category: 'estimate',
        paperSize: 'A4',
        orientation: 'portrait',
        dimensions: { width: 210, height: 297, unit: 'mm' },
        margins: { top: 25, right: 25, bottom: 25, left: 25 },
        elements: [],
        isDefault: false,
        isActive: true,
        createdBy: '2',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01'),
        version: 1,
        tags: ['estimate', 'service'],
      },
    ];
    setTemplates(sampleTemplates);
  }, []);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateNew = () => {
    setEditingTemplate(null);
    setIsBuilderOpen(true);
  };

  const handleEdit = (template: InvoiceTemplate) => {
    setEditingTemplate(template);
    setIsBuilderOpen(true);
  };

  const handleSaveTemplate = (template: InvoiceTemplate) => {
    if (editingTemplate) {
      // Update existing template
      setTemplates(prev => prev.map(t => 
        t.id === editingTemplate.id ? { ...template, id: editingTemplate.id } : t
      ));
    } else {
      // Create new template
      const newTemplate = {
        ...template,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setTemplates(prev => [...prev, newTemplate]);
    }
    setIsBuilderOpen(false);
    setEditingTemplate(null);
  };

  const handleDelete = (template: InvoiceTemplate) => {
    setTemplateToDelete(template);
    onOpen();
  };

  const confirmDelete = () => {
    if (templateToDelete) {
      setTemplates(prev => prev.filter(t => t.id !== templateToDelete.id));
      setTemplateToDelete(null);
    }
    onOpenChange();
  };

  const handleDuplicate = (template: InvoiceTemplate) => {
    const duplicated = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
    };
    setTemplates(prev => [...prev, duplicated]);
  };

  const handleSetDefault = (template: InvoiceTemplate) => {
    setTemplates(prev => prev.map(t => ({
      ...t,
      isDefault: t.id === template.id,
    })));
  };

  if (!hasPermission('invoice_templates')) {
    return (
      <Card className="m-4">
        <CardBody className="text-center py-8">
          <Icon icon="lucide:lock" className="text-4xl text-default-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-default-600">
            You don't have permission to manage invoice templates.
          </p>
        </CardBody>
      </Card>
    );
  }

  if (isBuilderOpen) {
    return (
      <InvoiceBuilder
        template={editingTemplate || undefined}
        onSave={handleSaveTemplate}
        onCancel={() => {
          setIsBuilderOpen(false);
          setEditingTemplate(null);
        }}
      />
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Invoice Templates</h1>
          <p className="text-default-600">
            Create and manage custom invoice templates with drag-and-drop builder
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Icon icon="lucide:plus" />}
          onPress={handleCreateNew}
        >
          Create Template
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardBody>
          <div className="flex gap-4 items-end">
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              startContent={<Icon icon="lucide:search" />}
              className="flex-1"
            />
            <Select
              placeholder="All Categories"
              selectedKeys={[selectedCategory]}
              onSelectionChange={(keys) => setSelectedCategory(Array.from(keys)[0] as string)}
              className="w-48"
            >
              <SelectItem key="all">All Categories</SelectItem>
              <SelectItem key="invoice">Invoice</SelectItem>
              <SelectItem key="receipt">Receipt</SelectItem>
              <SelectItem key="estimate">Estimate</SelectItem>
              <SelectItem key="custom">Custom</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Templates Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Templates ({filteredTemplates.length})</h3>
        </CardHeader>
        <CardBody>
          <Table aria-label="Invoice templates">
            <TableHeader>
              <TableColumn>NAME</TableColumn>
              <TableColumn>CATEGORY</TableColumn>
              <TableColumn>PAPER SIZE</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>CREATED</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {template.name}
                        {template.isDefault && (
                          <Chip size="sm" color="primary" variant="flat">
                            Default
                          </Chip>
                        )}
                      </div>
                      {template.description && (
                        <div className="text-sm text-default-500">
                          {template.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={
                        template.category === 'invoice' ? 'primary' :
                        template.category === 'receipt' ? 'success' :
                        template.category === 'estimate' ? 'warning' : 'default'
                      }
                    >
                      {template.category}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {template.paperSize} • {template.orientation}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      color={template.isActive ? 'success' : 'default'}
                      variant="flat"
                    >
                      {template.isActive ? 'Active' : 'Inactive'}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {template.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="light">
                          <Icon icon="lucide:more-horizontal" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem
                          key="edit"
                          startContent={<Icon icon="lucide:edit" />}
                          onPress={() => handleEdit(template)}
                        >
                          Edit
                        </DropdownItem>
                        <DropdownItem
                          key="duplicate"
                          startContent={<Icon icon="lucide:copy" />}
                          onPress={() => handleDuplicate(template)}
                        >
                          Duplicate
                        </DropdownItem>
                        {!template.isDefault && (
                          <DropdownItem
                            key="set-default"
                            startContent={<Icon icon="lucide:star" />}
                            onPress={() => handleSetDefault(template)}
                          >
                            Set as Default
                          </DropdownItem>
                        )}
                        <DropdownItem
                          key="delete"
                          className="text-danger"
                          color="danger"
                          startContent={<Icon icon="lucide:trash-2" />}
                          onPress={() => handleDelete(template)}
                        >
                          Delete
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete Template
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete "{templateToDelete?.name}"? 
                  This action cannot be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="danger" onPress={confirmDelete}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
