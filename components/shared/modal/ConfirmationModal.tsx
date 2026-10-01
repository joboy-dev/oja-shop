import Modal from './Modal'
import Button from '../button/Button';

interface ModalProps {
  title?: string
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  content?: string;
  isLoading: boolean;
}

export default function ConfirmationModal({
  title,
  isOpen,
  isLoading,
  onConfirm,
  content,
  onClose,
}: ModalProps ) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title ?? 'Are you sure?'}
      size='sm'
    >
      <p className='text-lg text-muted-foreground mb-4 '>{content}</p>
      <div className='flex items-end justify-end gap-6'>
        <Button
          size='sm'
          variant='danger'
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>

         <Button
          size='sm'
          variant='primary'
          onClick={onConfirm}
          isLoading={isLoading}
          disabled={isLoading}
        >
          Proceed
        </Button>
      </div>
    </Modal>
  )
}
