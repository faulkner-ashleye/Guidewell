'use client';
import React, { useRef, useEffect } from 'react';
import { useAppState } from '../../state/AppStateContext';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function UploadDocumentModal({ open, onClose }: Props) {
  const { setAccounts, clearSampleData } = useAppState();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleParsed = (accounts: any[]) => {
    // Clear sample data when user uploads their own documents
    clearSampleData();
    setAccounts(accounts);
    onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      // Process the files immediately
      processDocumentsWithAI(files);
    }
  };

  // Mock AI processing function - replace with actual AI service call
  const processDocumentsWithAI = async (files: File[]): Promise<any[]> => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock extracted account data - replace with actual AI extraction
    return [
      {
        id: 'extracted-checking-001',
        name: 'Checking Account',
        type: 'checking',
        balance: 2500.00,
        monthlyContribution: 0
      },
      {
        id: 'extracted-savings-001',
        name: 'Savings Account',
        type: 'savings',
        balance: 5000.00,
        monthlyContribution: 200
      }
    ];
  };

  // When modal opens, immediately trigger file browser
  useEffect(() => {
    if (open && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [open]);

  // Process files when they're selected
  useEffect(() => {
    if (open) {
      const handleFileProcess = async () => {
        const files = fileInputRef.current?.files;
        if (files && files.length > 0) {
          const processedAccounts = await processDocumentsWithAI(Array.from(files));
          handleParsed(processedAccounts);
        }
      };

      const input = fileInputRef.current;
      if (input) {
        input.addEventListener('change', handleFileProcess);
        return () => input.removeEventListener('change', handleFileProcess);
      }
    }
  }, [open]);

  return (
    <>
      {/* Only render file input when modal is open */}
      {open && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      )}
    </>
  );
}
