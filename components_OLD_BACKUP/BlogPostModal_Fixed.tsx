/**
 * Componente modal para mostrar posts del blog en detalle.
 * Propósito: Mostrar un post del blog en un modal con animaciones y navegación.
 * Lógica: Gestiona el estado del modal, previene scroll del body, maneja eventos de teclado y renderiza contenido sanitizado.
 * Entradas: isOpen (boolean), post (BlogPost | null), onClose (función).
 * Salidas: Renderiza el modal con el contenido del post.
 * Dependencias: React, framer-motion para animaciones, DOMPurify para sanitización, BlogPost type.
 * Efectos secundarios: Modifica el overflow del body, agrega/remueve event listeners de teclado.
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DOMPurify from 'dompurify';
import { BlogPost } from '../src/types/blog';

/**
 * Props del componente BlogPostModal.
 * Propósito: Define la interfaz de propiedades para el modal de posts del blog.
 * Lógica: Especifica los parámetros necesarios para controlar el estado y contenido del modal.
 * Entradas: isOpen, post, onClose.
 * Salidas: Ninguna (es una interfaz de tipos).
 * Dependencias: BlogPost type.
 * Efectos secundarios: Ninguno.
 */
interface BlogPostModalProps {
  isOpen: boolean;
  post: BlogPost | null;
  onClose: () => void;
}

/**
 * Componente funcional BlogPostModal.
 * Propósito: Renderizar un modal animado para mostrar posts del blog.
 * Lógica: Gestiona efectos secundarios para scroll y teclado, renderiza contenido condicionalmente.
 * Entradas: Props desestructuradas (isOpen, post, onClose).
 * Salidas: JSX del modal o null si no hay post.
 * Dependencias: useEffect de React, props del componente.
 * Efectos secundarios: Modifica estilos del body y agrega event listeners.
 */
const BlogPostModal: React.FC<BlogPostModalProps> = ({
  isOpen,
  post,
  onClose,
}) => {
  /**
   * Efecto para prevenir scroll del body cuando el modal está abierto.
   * Propósito: Mejorar UX evitando scroll accidental del fondo.
   * Lógica: Modifica el overflow del body basado en isOpen.
   * Entradas: isOpen (boolean).
   * Salidas: Ninguna.
   * Dependencias: isOpen.
   * Efectos secundarios: Modifica document.body.style.overflow.
   */
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

  /**
   * Efecto para manejar la tecla ESC para cerrar el modal.
   * Propósito: Proporcionar navegación por teclado accesible.
   * Lógica: Agrega/remueve event listener para keydown cuando el modal está abierto.
   * Entradas: isOpen (boolean), onClose (función).
   * Salidas: Ninguna.
   * Dependencias: isOpen, onClose.
   * Efectos secundarios: Agrega event listener a window.
   */
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

  /**
   * Renderizado condicional: retorna null si no hay post.
   * Propósito: Evitar renderizar el modal sin contenido válido.
   * Lógica: Verificación simple de existencia del post.
   * Entradas: post (BlogPost | null).
   * Salidas: null o JSX del modal.
   * Dependencias: post.
   * Efectos secundarios: Ninguno.
   */
  if (!post) return null;

  /**
   * Renderizado del modal con animaciones.
   * Propósito: Mostrar el post del blog en un modal superpuesto con transiciones suaves.
   * Lógica: Usa AnimatePresence y motion.div para animaciones, estructura en header/contenido/footer.
   * Entradas: isOpen, post, onClose.
   * Salidas: JSX del modal completo.
   * Dependencias: framer-motion, DOMPurify, post data.
   * Efectos secundarios: Renderiza HTML sanitizado con dangerouslySetInnerHTML.
   */
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
            {/* Header con imagen y botón cerrar */}
            <div className="relative">
              {post.imageUrl && (
                <div className="h-64 w-full overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
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

            {/* Contenido principal del post */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>

              <div className="text-gray-600 mb-6 border-l-4 border-green-500 pl-4">
                <p className="italic">{post.summary}</p>
              </div>

              <div className="prose prose-lg max-w-none">
                {/* Renderizar contenido del post con sanitización */}
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(post.content),
                  }}
                />
              </div>
            </div>

            {/* Footer con información y botón cerrar */}
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
