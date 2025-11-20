import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogPost } from '../types';
import {
  sanitizeHtml,
  sanitizeText,
  sanitizeUrl,
} from '../src/utils/sanitizer';

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
  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Manejar tecla ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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

  if (!post) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative">
              {safeImageUrl && (
                <div className="h-64 w-full overflow-hidden">
                  <img
                    src={safeImageUrl}
                    alt={safeTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all"
                aria-label="Cerrar modal"
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

            {/* Contenido */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {safeTitle}
              </h1>

              <div className="text-gray-600 mb-6 border-l-4 border-green-500 pl-4">
                <p className="italic">{safeSummary}</p>
              </div>

              <div className="prose prose-lg max-w-none">
                {/* Renderizar contenido del post */}
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: safeContent }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Artículo de PuraNatura
                </div>
                <button
                  onClick={onClose}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BlogPostModal;
