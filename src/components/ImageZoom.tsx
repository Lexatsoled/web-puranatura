import React, { useState, useRef } from 'react';

interface ImageZoomProps {
  src: string;
  alt: string;
  zoom?: number;
  className?: string;
}

const ImageZoom: React.FC<ImageZoomProps> = ({ 
  src, 
  alt, 
  zoom = 2.0, 
  className = "" 
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const magnifierRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !imageRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePosition({ x, y });

    // Actualizar posición del cursor de lupa
    if (magnifierRef.current) {
      const cursorSize = 40; // Tamaño del cursor de lupa
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

  // Simplificar la lógica de carga - eliminando debug innecesario
  const handleImageLoad = () => {
    // Imagen cargada correctamente
  };

  const handleImageError = () => {
    console.error('ImageZoom: Error loading image:', src);
  };

  // Función para limpiar la URL de la imagen
  const getCleanImageSrc = (imageSrc: string) => {
    if (!imageSrc) return '';
    // Codificar espacios y caracteres especiales en la URL
    return imageSrc.replace(/ /g, '%20');
  };

  const cleanSrc = getCleanImageSrc(src);

  return (
    <div className={`relative ${className}`}>
      {/* Contenedor principal de la imagen */}
      <div
        ref={containerRef}
        className="relative w-full bg-white cursor-zoom-in overflow-hidden rounded-lg border border-gray-200 group"
        style={{ aspectRatio: '1/1' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          ref={imageRef}
          src={cleanSrc}
          alt={alt}
          className={`w-full h-full object-contain p-4 transition-all duration-300 ease-in-out`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />

        {/* Overlay de hover con efecto de sombreado */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isHovering ? 'opacity-10' : 'opacity-0'
          }`} 
        />

        {/* Cursor de lupa sobre la imagen - siempre disponible cuando hover */}
        {isHovering && (
          <div 
            ref={magnifierRef}
            className="absolute w-10 h-10 border-2 border-white rounded-full bg-white bg-opacity-30 pointer-events-none hidden md:flex items-center justify-center z-10"
            style={{
              boxShadow: '0 0 0 1px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.2)',
            }}
          >
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        )}

        {/* Indicador de zoom - siempre visible cuando no hover */}
        <div 
          className={`absolute bottom-3 right-3 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 transition-all duration-300 ${
            isHovering ? 'opacity-0' : 'opacity-100 scale-100'
          }`}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Ampliar</span>
        </div>
      </div>

      {/* ÚNICO Magnifier - lateral para pantallas grandes, overlay para pequeñas */}
      {showMagnifier && cleanSrc && (
        <>
          {/* Magnifier lateral para pantallas grandes */}
          <div 
            className="absolute top-0 left-full ml-4 w-full h-full border-4 border-blue-500 rounded-lg shadow-2xl bg-white pointer-events-none hidden lg:block z-30"
            style={{
              backgroundImage: `url(${cleanSrc})`,
              backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
              backgroundSize: `${zoom * 100}%`,
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Header visible */}
            <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white text-center py-2 font-bold">
              LUPA ACTIVA - {zoom}x
            </div>
            
            {/* Punto de referencia */}
            <div 
              className="absolute w-4 h-4 bg-red-500 border-2 border-white rounded-full"
              style={{
                left: `${mousePosition.x}%`,
                top: `${mousePosition.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            ></div>
          </div>

          {/* Magnifier overlay para pantallas pequeñas */}
          <div 
            className="absolute inset-4 border-4 border-green-500 rounded-lg overflow-hidden pointer-events-none lg:hidden z-30 bg-white bg-opacity-95"
            style={{
              backgroundImage: `url(${cleanSrc})`,
              backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
              backgroundSize: `${zoom * 100}%`,
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Indicador para overlay */}
            <div className="absolute top-2 left-2 bg-green-600 text-white text-sm font-bold px-3 py-1 rounded shadow-lg">
              ZOOM {zoom}x
            </div>
            
            {/* Crosshair */}
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
