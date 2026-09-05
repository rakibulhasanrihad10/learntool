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
  const previouslyFocusedRef = useRef<Element | null>(null);

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

  // Focus management: trap Tab inside, restore focus on close.
  useEffect(() => {
    if (!isOpen) return;
    // Remember the trigger so focus returns to it on close.
    previouslyFocusedRef.current = document.activeElement;
    // Lock background scroll while the dialog is open.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Move focus into the dialog (first focusable element, else the dialog).
    const node = contentRef.current;
    if (node) {
      const focusable = node.querySelector<HTMLElement>(
        'input, button:not([disabled]), [href], select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      (focusable ?? node).focus({ preventScroll: true });
    }

    // Minimal focus trap: cycle Tab inside the dialog.
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !contentRef.current) return;
      const elements = Array.from(
        contentRef.current.querySelectorAll<HTMLElement>(
          'input, button:not([disabled]), [href], select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null);
      if (elements.length === 0) {
        e.preventDefault();
        return;
      }
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleTab);

    return () => {
      document.removeEventListener('keydown', handleTab);
      document.body.style.overflow = previousOverflow;
      const previous = previouslyFocusedRef.current as HTMLElement | null;
      if (previous && typeof previous.focus === 'function') {
        previous.focus({ preventScroll: true });
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="m3-modal-backdrop" role="dialog" aria-modal="true" aria-label={title ?? 'Dialog'}>
      <div
        ref={contentRef}
        tabIndex={-1}
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
