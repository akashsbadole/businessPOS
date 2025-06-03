import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  Progress,
  Chip,
  Divider
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useInventoryStore } from '../../stores/inventory-store';

interface CSVUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CSVUploadModal: React.FC<CSVUploadModalProps> = ({
  isOpen,
  onClose
}) => {
  const { importFromCSV, isImporting, importProgress } = useInventoryStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      setSelectedFile(file);
    } else {
      alert('Please select a CSV file');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      await importFromCSV(selectedFile);
      setSelectedFile(null);
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please check your CSV format and try again.');
    }
  };

  const downloadTemplate = () => {
    const headers = ['Name', 'Category', 'Price', 'Stock', 'HSN', 'Barcode', 'Tax Rate'];
    const sampleData = [
      'Sample Product,Electronics,999.99,50,85234567,1234567890123,18',
      'Another Product,Grocery,49.99,100,12345678,9876543210987,5'
    ];
    
    const csvContent = [headers.join(','), ...sampleData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      isDismissable={!isImporting}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Icon icon="lucide:upload" className="text-xl" />
            <span>Import Inventory from CSV</span>
          </div>
          <p className="text-sm text-default-500">
            Upload a CSV file to bulk import products into your inventory
          </p>
        </ModalHeader>
        
        <ModalBody>
          {/* CSV Format Instructions */}
          <Card>
            <CardBody className="p-4">
              <h4 className="font-semibold mb-2">CSV Format Requirements</h4>
              <div className="space-y-2 text-sm">
                <p>Your CSV file should include the following columns:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <Chip size="sm" variant="flat">Name</Chip>
                    <span className="text-default-600">Required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip size="sm" variant="flat">Category</Chip>
                    <span className="text-default-600">Required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip size="sm" variant="flat">Price</Chip>
                    <span className="text-default-600">Required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip size="sm" variant="flat">Stock</Chip>
                    <span className="text-default-600">Required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip size="sm" variant="flat">HSN</Chip>
                    <span className="text-default-600">Optional</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip size="sm" variant="flat">Barcode</Chip>
                    <span className="text-default-600">Optional</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip size="sm" variant="flat">Tax Rate</Chip>
                    <span className="text-default-600">Optional (default: 18%)</span>
                  </div>
                </div>
              </div>
              
              <Divider className="my-3" />
              
              <Button
                size="sm"
                variant="flat"
                startContent={<Icon icon="lucide:download" />}
                onPress={downloadTemplate}
              >
                Download Template
              </Button>
            </CardBody>
          </Card>

          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary-50' 
                : 'border-default-300 hover:border-default-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-2">
                <Icon icon="lucide:file-text" className="text-4xl text-success mx-auto" />
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-default-500">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
                <Button
                  size="sm"
                  variant="flat"
                  color="danger"
                  onPress={() => setSelectedFile(null)}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Icon icon="lucide:upload-cloud" className="text-6xl text-default-300 mx-auto" />
                <div>
                  <p className="text-lg font-medium">Drop your CSV file here</p>
                  <p className="text-default-500">or click to browse</p>
                </div>
                <Button
                  color="primary"
                  variant="flat"
                  onPress={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.csv';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleFileSelect(file);
                    };
                    input.click();
                  }}
                >
                  Select CSV File
                </Button>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {isImporting && (
            <Card>
              <CardBody className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Importing products...</span>
                    <span className="text-sm text-default-500">
                      {importProgress.toFixed(0)}%
                    </span>
                  </div>
                  <Progress 
                    value={importProgress} 
                    color="primary"
                    className="w-full"
                  />
                  <p className="text-sm text-default-500">
                    Please wait while we process your CSV file.
                  </p>
                </div>
              </CardBody>
            </Card>
          )}
        </ModalBody>
        
        <ModalFooter>
          <Button 
            variant="light" 
            onPress={onClose}
            isDisabled={isImporting}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleUpload}
            isDisabled={!selectedFile || isImporting}
            isLoading={isImporting}
          >
            Import Products
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
