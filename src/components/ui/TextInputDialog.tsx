'use client';

import Modal from '@/components/ui/Modal';

interface TextInputDialogProps {
  open: boolean;
  title: string;
  label: string;
  placeholder?: string;
  value: string;
  confirmLabel: string;
  cancelLabel?: string;
  onChange: (value: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export default function TextInputDialog({
  open,
  title,
  label,
  placeholder,
  value,
  confirmLabel,
  cancelLabel = 'Cancel',
  onChange,
  onConfirm,
  onClose,
}: TextInputDialogProps) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <label htmlFor="textInputDialog" className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id="textInputDialog"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
      />
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
