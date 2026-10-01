import React, { useState } from 'react';
import Modal from './modal/Modal';

type ImageProps = {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  rounded?: boolean;
  border?: boolean;
  lazy?: boolean;
  width?: number | string;
  height?: number | string;
  srcSet?: string;
  sizes?: string;
  showLoader?: boolean;
  showImageInModalOnClick?: boolean
  onClick?: () => void
};

function ImageComponent({
  src,
  alt,
  fallbackSrc = '/images/no-image.png', // provide a fallback image in public folder
  className = '',
  objectFit = 'cover',
  rounded = false,
  border = false,
  lazy = true,
  width = '100%',
  height = 'auto',
  srcSet,
  sizes,
  showLoader = false,
  showImageInModalOnClick = false,
  onClick,
}: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);

  const handleError = () => setError(true);
  const handleLoad = () => setLoaded(true);

  const style = {
    objectFit,
    width,
    height,
  } as React.CSSProperties;

  const combinedClass = `
    ${className}
    ${rounded ? 'rounded-xl' : ''}
    ${border ? 'border border-gray-300' : ''}
    ${!loaded && showLoader ? 'animate-pulse bg-gray-200' : ''}
  `.trim();

  return (
    <>
      <Modal
        title='Image Preview'
        size='sm'
        isOpen={openImageModal}
        onClose={() => setOpenImageModal(false)}
      >
        <img
          src={error ? fallbackSrc : src}
          alt={alt}
          // style={style}
          onError={handleError}
          onLoad={handleLoad}
          className={`${combinedClass} w-full h-full`}
          loading={lazy ? 'lazy' : 'eager'}
          srcSet={srcSet}
          sizes={sizes}
        />  
      </Modal>
      
      <img
        src={error ? fallbackSrc : src}
        alt={alt}
        style={style}
        onError={handleError}
        onLoad={handleLoad}
        className={`${combinedClass} cursor-pointer`}
        loading={lazy ? 'lazy' : 'eager'}
        srcSet={srcSet}
        sizes={sizes}
        onClick={() => {
          if (onClick) {
            onClick();
            return;
          }
          if (!showImageInModalOnClick) return null;
          setOpenImageModal(true)
        }}
      />
    </>
  );
}

export default ImageComponent;
