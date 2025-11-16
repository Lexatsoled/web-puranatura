import React, { useState, useRef, useMemo } from 'react';
import { normalizeSrcSet } from '../utils/image';

// Timestamp único para cache-busting que se mantiene durante toda la sesión
const APP_VERSION = Date.now();

interface ImageZoomProps {
  src: string;
  alt: string;
  zoom?: number;
  className?: string;
  srcSet?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
  // Acepta ambas variantes (camelCase y lowercase)
  fetchPriority?: 'high' | 'low' | 'auto';
  fetchpriority?: 'high' | 'low' | 'auto';
}

// normalizeSrcSet is provided by the shared utils/image helper

const ImageZoom: React.FC<ImageZoomProps> = (props) => {
  // Destructurar SOLO las props que necesitamos, ignorando cualquier otra
  const {
    src,
    alt,
    zoom = 2.0,
    className = '',
    srcSet,
    sizes,
    loading = 'lazy',
    decoding = 'async',
  } = props;
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const magnifierRef = useRef<HTMLDivElement>(null);

  const cleanSrc = useMemo(() => {
    // Si src está vacío o inválido, usar placeholder
    if (!src || src.trim() === '') {
      return '/placeholder-product.jpg';
    }
    // Agregar versión de app para cache-busting (se mantiene igual durante toda la sesión)
    const separator = src.includes('?') ? '&' : '?';
    return `${src}${separator}v=${APP_VERSION}`;
  }, [src]);
  
  const cleanSrcSet = useMemo(() => normalizeSrcSet(srcSet), [srcSet]);

  // Normaliza fetchPriority: prioriza camelCase si llega, si no la lowercase, por defecto 'auto'
  const fetchPriorityValue = (props.fetchPriority ?? props.fetchpriority ?? 'auto') as 'high' | 'low' | 'auto';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !imageRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePosition({ x, y });

    if (magnifierRef.current) {
      const cursorSize = 40;
      magnifierRef.current.style.left = `${e.clientX - rect.left - cursorSize / 2}px`;
      magnifierRef.current.style.top = `${e.clientY - rect.top - cursorSize / 2}px`;
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setShowMagnifier(false);
  };

  const handleImageLoad = () => {
    // Imagen cargada correctamente
  };
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const failedSrc = e.currentTarget.src;
    // Solo usar placeholder si no es ya el placeholder
    if (!failedSrc.includes('placeholder') && imageRef.current) {
      // Silencioso - solo cambiamos a placeholder sin warning ya que puede ser caché
      imageRef.current.src = '/placeholder-product.jpg';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={containerRef}
        className="relative w-full bg-white cursor-zoom-in overflow-hidden rounded-lg border border-gray-200 group"
        style={{ aspectRatio: '1/1' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <picture>
          {/* AVIF format - best compression */}
          <source
            srcSet={cleanSrcSet ? cleanSrcSet.replace(/\.(jpg|jpeg|png)$/gi, '.avif') : cleanSrc.replace(/\.(jpg|jpeg|png)$/gi, '.avif')}
            sizes={sizes}
            type="image/avif"
          />
          {/* WebP format - widely supported */}
          <source
            srcSet={cleanSrcSet ? cleanSrcSet.replace(/\.(jpg|jpeg|png)$/gi, '.webp') : cleanSrc.replace(/\.(jpg|jpeg|png)$/gi, '.webp')}
            sizes={sizes}
            type="image/webp"
          />
          {/* Fallback JPEG/PNG */}
          <img
            ref={imageRef}
            src={cleanSrc}
            srcSet={cleanSrcSet}
            sizes={sizes}
            alt={alt}
            className="w-full h-full object-contain p-4 transition-all duration-300 ease-in-out"
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading={loading}
            decoding={decoding}
            {...{ fetchpriority: fetchPriorityValue }}
          />
        </picture>

        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isHovering ? 'opacity-10' : 'opacity-0'
          }`}
        />

        {isHovering && (
          <div
            ref={magnifierRef}
            className="absolute w-10 h-10 border-2 border-white rounded-full bg-white bg-opacity-30 pointer-events-none hidden md:flex items-center justify-center z-10"
            style={{
              boxShadow: '0 0 0 1px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.2)',
            }}
          >
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        )}

        <div
          className={`absolute bottom-3 right-3 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 transition-all duration-300 ${
            isHovering ? 'opacity-0' : 'opacity-100 scale-100'
          }`}
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span>Ampliar</span>
        </div>
      </div>

      {showMagnifier && cleanSrc && (
        <>
          <div
            className="absolute top-0 left-full ml-4 w-full h-full border-4 border-blue-500 rounded-lg shadow-2xl bg-white pointer-events-none hidden lg:block z-30"
            style={{
              backgroundImage: `url(${cleanSrc})`,
              backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
              backgroundSize: `${zoom * 100}%`,
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white text-center py-2 font-bold">
              LUPA ACTIVA - {zoom}x
            </div>

            <div
              className="absolute w-4 h-4 bg-red-500 border-2 border-white rounded-full"
              style={{
                left: `${mousePosition.x}%`,
                top: `${mousePosition.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            ></div>
          </div>

          <div
            className="absolute inset-4 border-4 border-green-500 rounded-lg overflow-hidden pointer-events-none lg:hidden z-30 bg-white bg-opacity-95"
            style={{
              backgroundImage: `url(${cleanSrc})`,
              backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
              backgroundSize: `${zoom * 100}%`,
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="absolute top-2 left-2 bg-green-600 text-white text-sm font-bold px-3 py-1 rounded shadow-lg">
              ZOOM {zoom}x
            </div>

            <div
              className="absolute w-6 h-6 border-2 border-red-500 rounded-full bg-red-500 bg-opacity-20"
              style={{
                left: `${mousePosition.x}%`,
                top: `${mousePosition.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="absolute inset-1 border border-white rounded-full"></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ImageZoom;

