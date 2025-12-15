import React, { useRef } from 'react';
import { BlogPost } from '../../types/blog';
import { XIcon } from '../icons';

import { useFocusTrap } from '../../hooks/useFocusTrap';
import { sanitizeHTML } from '../../utils/sanitizer';

interface BlogPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: BlogPost | null;
}

const BlogPostModal: React.FC<BlogPostModalProps> = ({
  isOpen,
  onClose,
  post,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useFocusTrap(dialogRef, {
    isActive: !!post && isOpen,
    onEscape: onClose,
  });

  // Note: keydown 'Escape' logic is now handled by useFocusTrap if we pass onEscape,
  // but if we want to be safe we can keep global listener or rely on hook.
  // The hook attaches listener to document, which is fine.
  // We can remove the manual useEffect for Escape in this file as useFocusTrap handles it.

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="fixed inset-0 w-full h-full bg-black bg-opacity-50 transition-opacity cursor-default"
        onClick={onClose}
        aria-label="Cerrar modal"
      />
      <div
        ref={dialogRef}
        className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto z-10"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="relative">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-64 object-cover rounded-t-lg bg-gray-100"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            width={800} /* Aspect ratio estimado, previene salto */
            height={256}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            aria-label="Cerrar"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span>
              {post.date ? new Date(post.date).toLocaleDateString() : ''}
            </span>
            <span>•</span>
            <span>{post.author || 'PuraNatura'}</span>
            <span>•</span>
            <span>{post.readTime || 5} min de lectura</span>
          </div>

          <h2
            id="modal-title"
            className="text-3xl font-bold font-display text-green-900 mb-6"
          >
            {post.title}
          </h2>

          <div
            className="prose prose-green max-w-none text-gray-700"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.content) }}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogPostModal;
