import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Chip,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface RemarksModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentRemarks: string;
  onRemarksChange: (remarks: string) => void;
}

export const RemarksModal: React.FC<RemarksModalProps> = ({
  isOpen,
  onOpenChange,
  currentRemarks,
  onRemarksChange,
}) => {
  const [remarks, setRemarks] = React.useState(currentRemarks);

  React.useEffect(() => {
    if (isOpen) {
      setRemarks(currentRemarks);
    }
  }, [isOpen, currentRemarks]);

  const handleSubmit = () => {
    onRemarksChange(remarks.trim());
    onOpenChange(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.ctrlKey && event.key === "Enter") {
      handleSubmit();
    }
  };

  const quickRemarks = [
    "Thank you for your business!",
    "Please visit again",
    "Special discount applied",
    "Bulk order discount",
    "Festival offer",
    "Customer loyalty reward",
    "First time customer",
    "Regular customer",
    "Cash payment discount",
    "Advance payment received",
  ];

  const handleQuickRemark = (remark: string) => {
    if (remarks.trim()) {
      setRemarks(remarks + "\n" + remark);
    } else {
      setRemarks(remark);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2">
              <Icon icon="lucide:message-square" />
              <span>Bill Remarks</span>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div>
                  <Textarea
                    label="Remarks"
                    placeholder="Enter any special notes or remarks for this bill..."
                    value={remarks}
                    onValueChange={setRemarks}
                    onKeyDown={handleKeyDown}
                    minRows={4}
                    maxRows={8}
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Press Ctrl+Enter to save quickly
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Quick Remarks:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickRemarks.map((remark, index) => (
                      <Chip
                        key={index}
                        variant="flat"
                        className="cursor-pointer hover:bg-primary/20"
                        onClick={() => handleQuickRemark(remark)}
                      >
                        {remark}
                      </Chip>
                    ))}
                  </div>
                </div>

                {remarks.trim() && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium mb-1">Preview:</p>
                    <p className="text-sm whitespace-pre-wrap">{remarks}</p>
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button
                variant="flat"
                color="warning"
                onPress={() => {
                  setRemarks("");
                }}
              >
                Clear
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
              >
                Save Remarks
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
