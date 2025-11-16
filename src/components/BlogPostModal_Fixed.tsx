/**
 * Componente modal para mostrar posts del blog en detalle.
 * Propósito: Mostrar un post del blog en un modal con animaciones y navegación accesible.
 * Lógica: Utiliza Framer Motion para animaciones, maneja eventos de teclado y previene scroll del body.
 * Entradas: isOpen (boolean), post (BlogPost | null), onClose (función).
 * Salidas: Renderiza el modal con el contenido del post o null si no hay post.
 * Dependencias: React, Framer Motion, tipos BlogPost.
 * Efectos secundarios: Modifica el overflow del body y agrega/remueve event listeners globales.
 */
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogPost } from '../types';

/**
 * Props del componente BlogPostModal.
 * Propósito: Definir la interfaz de propiedades para el modal de posts del blog.
 * Lógica: Especifica los parámetros necesarios para controlar el estado y contenido del modal.
 * Entradas: Ninguna (es una interfaz de tipos).
 * Salidas: Ninguna (es una interfaz de tipos).
 * Dependencias: Depende del tipo BlogPost.
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
 * Lógica: Gestiona el estado del modal, previene scroll del body y maneja eventos de teclado.
 * Entradas: Props de tipo BlogPostModalProps.
 * Salidas: JSX del modal o null.
 * Dependencias: useEffect de React.
 * Efectos secundarios: Modifica estilos del body y agrega event listeners globales.
 */
const BlogPostModal: React.FC<BlogPostModalProps> = ({
  isOpen,
  post,
  onClose,
}) => {
  /**
   * Hook useEffect para prevenir scroll del body.
   * Propósito: Evitar que el usuario pueda hacer scroll en el fondo cuando el modal está abierto.
   * Lógica: Modifica la propiedad overflow del body según el estado del modal.
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
   * Hook useEffect para manejar la tecla ESC.
   * Propósito: Permitir cerrar el modal presionando la tecla Escape.
   * Lógica: Agrega un event listener para keydown y verifica si es Escape.
   * Entradas: isOpen (boolean), onClose (función).
   * Salidas: Ninguna.
   * Dependencias: isOpen, onClose.
   * Efectos secundarios: Agrega/remueve event listener global en window.
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
   * Renderizado condicional del modal.
   * Propósito: Solo renderizar el modal si hay un post disponible.
   * Lógica: Verifica si post existe, de lo contrario retorna null.
   * Entradas: post (BlogPost | null).
   * Salidas: JSX del modal o null.
   * Dependencias: Ninguna.
   * Efectos secundarios: Ninguno.
   */
  if (!post) return null;

  /**
   * Renderizado del modal con animaciones.
   * Propósito: Mostrar el post del blog en un modal con animaciones suaves.
   * Lógica: Utiliza AnimatePresence y motion para transiciones, incluye overlay y contenido.
   * Entradas: isOpen (boolean), post (BlogPost), onClose (función).
   * Salidas: JSX del modal completo.
   * Dependencias: Framer Motion, post data.
   * Efectos secundarios: Maneja eventos de click para cerrar el modal.
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
            {/**
             * Sección del header del modal.
             * Propósito: Mostrar la imagen del post (si existe) y el botón de cerrar.
             * Lógica: Renderiza condicionalmente la imagen y posiciona absolutamente el botón de cierre.
             * Entradas: post.imageUrl (string opcional), post.title (string), onClose (función).
             * Salidas: JSX del header.
             * Dependencias: post data.
             * Efectos secundarios: Maneja click del botón para cerrar modal.
             */}
            <div className="relative">
              <div className="h-64 w-full overflow-hidden">
                <img alt={post.title} className="w-full h-full object-cover" />
              </div>

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

            {/**
             * Sección del contenido del modal.
             * Propósito: Mostrar el título, resumen y contenido completo del post del blog.
             * Lógica: Renderiza el contenido con estilos tipográficos y scroll interno.
             * Entradas: post.title (string), post.summary (string), post.content (string HTML).
             * Salidas: JSX del contenido.
             * Dependencias: post data.
             * Efectos secundarios: Renderiza HTML inseguro con dangerouslySetInnerHTML.
             */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>

              <div className="text-gray-600 mb-6 border-l-4 border-green-500 pl-4"></div>

              <div className="prose prose-lg max-w-none">
                {/**
                 * Renderizado del contenido HTML del post.
                 * Propósito: Mostrar el contenido completo del artículo del blog.
                 * Lógica: Utiliza dangerouslySetInnerHTML para renderizar HTML almacenado.
                 * Entradas: post.content (string HTML).
                 * Salidas: Contenido HTML renderizado.
                 * Dependencias: post.content.
                 * Efectos secundarios: Riesgo de XSS si el contenido no está sanitizado.
                 */}
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </div>

            {/**
             * Sección del footer del modal.
             * Propósito: Mostrar información de marca y botón de cierre alternativo.
             * Lógica: Incluye texto de atribución y botón estilizado para cerrar el modal.
             * Entradas: onClose (función).
             * Salidas: JSX del footer.
             * Dependencias: onClose.
             * Efectos secundarios: Maneja click del botón para cerrar modal.
             */}
            <div className="border-t bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Artículo de Pureza Naturalis
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

/**
 * Exportación por defecto del componente BlogPostModal.
 * Propósito: Permitir la importación del componente en otros archivos.
 * Lógica: Exporta el componente funcional como módulo por defecto.
 * Entradas: Ninguna.
 * Salidas: Componente BlogPostModal.
 * Dependencias: Ninguna.
 * Efectos secundarios: Ninguno.
 */
export default BlogPostModal;
