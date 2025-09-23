'use client';
import { Modal } from '../../components/Modal';
import DocUpload from '../../components/DocUpload';
import { useAppState } from '../../state/AppStateContext';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function UploadDocumentModal({ open, onClose }: Props) {
  const { setAccounts, clearSampleData } = useAppState();

  const handleParsed = (accounts: any[]) => {
    // Clear sample data when user uploads their own documents
    clearSampleData();
    setAccounts(accounts);
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Upload Documents" size="large">
      <DocUpload onParsed={handleParsed} />
    </Modal>
  );
}
