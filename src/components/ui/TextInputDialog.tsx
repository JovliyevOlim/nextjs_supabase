'use client';

import Modal from '@/components/ui/Modal';
import {Loader2} from 'lucide-react';

interface TextInputDialogProps {
  open: boolean;
  title: string;
  label: string;
  placeholder?: string;
  value: string;
  confirmLabel: string;
  cancelLabel?: string;
  isLoading?: boolean;
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
  isLoading = false,
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
        disabled={isLoading}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
      />
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {isLoading && <Loader2 size={14} className="animate-spin"/>}
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
