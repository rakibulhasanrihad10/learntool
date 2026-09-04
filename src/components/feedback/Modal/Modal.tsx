import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/common/Button/Button';
import { X } from 'lucide-react';
import { cn } from '@/utils/classnames';
import { useClickOutside } from '@/hooks/useClickOutside';
import './Modal.css';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useClickOutside(contentRef, onClose, isOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="m3-modal-backdrop" role="dialog" aria-modal="true">
      <div
        ref={contentRef}
        className={cn('m3-modal', `m3-modal--${size}`, 'animate-slide-down', className)}
      >
        {title && (
          <div className="m3-modal__header">
            <h2 className="title-md">{title}</h2>
            <Button
              variant="icon"
              size="sm"
              onClick={onClose}
              aria-label="Close dialog"
            >
              <X size={18} />
            </Button>
          </div>
        )}
        <div className="m3-modal__body">{children}</div>
      </div>
    </div>
  );
};
