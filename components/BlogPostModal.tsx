import React, { useEffect, useMemo, useRef } from 'react';
// Use CSS overlay/modal transitions instead of framer-motion for BlogPostModal
import { BlogPost } from '../types';
import {
  sanitizeHtml,
  sanitizeText,
  sanitizeUrl,
} from '../src/utils/sanitizer';
import { useFocusTrap } from '../src/hooks/useFocusTrap';

interface BlogPostModalProps {
  isOpen: boolean;
  post: BlogPost | null;
  onClose: () => void;
}

const BlogPostModal: React.FC<BlogPostModalProps> = ({
  isOpen,
  post,
  onClose,
}) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const safeContent = useMemo(
    () => (post?.content ? sanitizeHtml(post.content) : ''),
    [post?.content]
  );
  const safeTitle = useMemo(
    () => (post?.title ? sanitizeText(post.title) : ''),
    [post?.title]
  );
  const safeSummary = useMemo(
    () => (post?.summary ? sanitizeText(post.summary) : ''),
    [post?.summary]
  );
  const safeImageUrl = useMemo(
    () => (post?.imageUrl ? sanitizeUrl(post.imageUrl) : ''),
    [post?.imageUrl]
  );

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useFocusTrap(dialogRef, {
    isActive: isOpen && Boolean(post),
    onEscape: onClose,
    initialFocusRef: closeButtonRef,
  });

  if (!post) return null;
  if (!isOpen) return null;

  return (
      <div
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
        role="presentation"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div
          className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-200"
          onMouseDown={(event) => event.stopPropagation()}
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="blog-post-title"
          tabIndex={-1}
        >
            <div className="relative">
              {safeImageUrl && (
                <div className="h-64 w-full overflow-hidden">
                  <img
                    src={safeImageUrl}
                    alt={safeTitle}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}

              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all"
                aria-label="Cerrar articulo"
                type="button"
                ref={closeButtonRef}
              >
                <svg
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
              <h1
                className="text-3xl font-bold text-gray-900 mb-4"
                id="blog-post-title"
              >
                {safeTitle}
              </h1>

              <div className="text-gray-600 mb-6 border-l-4 border-green-500 pl-4">
                <p className="italic">{safeSummary}</p>
              </div>

              <div className="prose prose-lg max-w-none">
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: safeContent }}
                />
              </div>
            </div>

            <div className="border-t bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Articulo de PuraNatura
                </div>
                <button
                  onClick={onClose}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  type="button"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      );
};

export default BlogPostModal;
