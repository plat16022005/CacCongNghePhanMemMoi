import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryLightboxProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export default function ImageGalleryLightbox({ images, isOpen, onClose, initialIndex = 0 }: ImageGalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen, initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-all z-50"
          >
            <X className="w-6 h-6" />
          </button>

          {images.length > 1 && (
            <>
              <button 
                onClick={handlePrev}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-all z-50"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              
              <button 
                onClick={handleNext}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-all z-50"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          <div className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center px-16">
            <motion.img 
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              src={images[currentIndex]}
              alt={`Gallery image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain select-none"
            />
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 bg-black/50 px-4 py-2 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
