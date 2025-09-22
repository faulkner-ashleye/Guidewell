import React, { useRef, useState } from 'react';
import { useAppState } from '../../../state/AppStateContext';
import { Button, ButtonVariants, ButtonColors } from '../../../components/Button';
import { OnboardingHeader } from '../components/OnboardingHeader';
import { Icon, IconNames } from '../../../components/Icon';
import { ValidationUtils, AccountSchema } from '../../../utils/validation';
import { FinancialCalculations } from '../../../utils/financialCalculations';
import '../../../components/Button.css';

interface ManualEntryProps {
  onNext: () => void;
  onBack: () => void;
}

export default function ManualEntry({ onNext, onBack }: ManualEntryProps) {
  const { setAccounts } = useAppState();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const addLinked = (arr: any[]) => {
    setAccounts(arr);
    onNext();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setAttachedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (attachedFiles.length === 0) return;

    setIsProcessing(true);
    setValidationMessage(null);

    try {
      // Simulate AI processing - in real implementation, this would call your AI service
      const processedAccounts = await processDocumentsWithAI(attachedFiles);
      
      if (processedAccounts && processedAccounts.length > 0) {
        addLinked(processedAccounts);
      } else {
        setValidationMessage('No financial data could be extracted from the uploaded documents. Please try uploading clearer images or different documents.');
      }
    } catch (error) {
      console.error('Error processing documents:', error);
      setValidationMessage('There was an error processing your documents. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Mock AI processing function - replace with actual AI service call
  const processDocumentsWithAI = async (files: File[]): Promise<any[]> => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
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

  return (
    <div className="onboarding-screen">
      <OnboardingHeader />

      <div className="onboarding-content">
        <div className="onboarding-step">
          <h1 className="typography-h1">Upload Documents</h1>
          <p className="typography-body1">
            Upload photos or PDFs of your financial documents to automatically extract account information.
          </p>

          <div className="upload-section">
            {/* Upload Area */}
            <div className="upload-area" onClick={handleUploadClick}>
              <div className="upload-icon">
                <Icon name={IconNames.file_upload} size="xl" />
              </div>
              <div className="upload-text">
                <span className="upload-label">Tap to upload photo</span>
                <span className="upload-formats">PNG, JPG or PDF (max. 10MB)</span>
              </div>
            </div>


            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              multiple
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>

          {/* Attached Files List */}
          {attachedFiles.length > 0 && (
            <div className="attached-files">
              <h3 className="typography-h3">Attached Documents</h3>
              <div className="file-list">
                {attachedFiles.map((file, index) => (
                  <div key={index} className="file-item">
                    <div className="file-content">
                      {/* File Icon */}
                      <div className="file-icon">
                        <Icon
                          name={file.type.startsWith('image/') ? IconNames.description : IconNames.description}
                          size="sm"
                        />
                      </div>
                      <div className="file-details">
                        <div className="file-name">{file.name}</div>
                        <div className="file-size">{formatFileSize(file.size)}</div>
                      </div>
                    </div>
                    <Button
                      variant={ButtonVariants.text}
                      color={ButtonColors.error}
                      onClick={() => removeFile(index)}
                      className="file-remove-btn"
                    >
                      <Icon name={IconNames.close} size="sm" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Validation Message */}
          {validationMessage && (
            <div className="validation-message">
              {validationMessage}
            </div>
          )}

        </div>
      </div>
      <div className="onboarding-actions">
        <div className="action-buttons">
           <Button
             variant={ButtonVariants.contained}
             color={ButtonColors.secondary}
             fullWidth={true}
             onClick={handleUpload}
             disabled={attachedFiles.length === 0 || isProcessing}
           >
             {isProcessing ? 'Processing...' : 'Process Documents'}
           </Button>
          <Button
            variant={ButtonVariants.outline}
            color={ButtonColors.secondary}
            fullWidth={true}
            onClick={onBack}
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
