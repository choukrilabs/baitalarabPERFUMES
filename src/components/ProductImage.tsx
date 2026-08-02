import React, { useState } from 'react';
import { PackageX } from 'lucide-react';

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({ src, alt, className }) => {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-100 text-gray-400 ${className}`}>
        <PackageX className="w-1/4 h-1/4 max-w-[48px] max-h-[48px] mb-2 opacity-50" />
        <span className="text-[10px] font-medium opacity-70 px-2 text-center truncate w-full">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
};
