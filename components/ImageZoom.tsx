
import React, { useState, useRef } from 'react';

interface ImageZoomProps {
  src: string;
  alt: string;
  zoom?: number;
}

const ImageZoom: React.FC<ImageZoomProps> = ({ src, alt, zoom = 2 }) => {
  const [showZoom, setShowZoom] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (containerRef.current) {
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;

      setPosition({ x: (x / width) * 100, y: (y / height) * 100 });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square cursor-zoom-in"
      onMouseEnter={() => setShowZoom(true)}
      onMouseLeave={() => setShowZoom(false)}
      onMouseMove={handleMouseMove}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover rounded-lg" />

      {showZoom && (
        <div
          className="absolute top-0 left-full ml-4 w-full h-full bg-no-repeat border rounded-lg shadow-lg pointer-events-none hidden md:block"
          style={{
            backgroundImage: `url(${src})`,
            backgroundPosition: `${position.x}% ${position.y}%`,
            backgroundSize: `${zoom * 100}%`,
          }}
        />
      )}
    </div>
  );
};

export default ImageZoom;
