import { X } from 'lucide-react';
import { Button } from './Button';

interface ImageViewerModalProps {
  src: string | null;
  onClose: () => void;
}

export function ImageViewerModal({ src, onClose }: ImageViewerModalProps) {
  if (!src) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-[9999] flex flex-col items-center justify-center p-4" 
      onClick={onClose}
    >
      <div className="absolute top-4 right-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-white/20" 
          onClick={onClose}
        >
          <X className="w-8 h-8" />
        </Button>
      </div>
      <img 
        src={src} 
        alt="Fullscreen view" 
        className="max-w-full max-h-[90vh] object-contain border-4 border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white" 
        referrerPolicy="no-referrer" 
        onClick={(e) => e.stopPropagation()} 
      />
    </div>
  );
}
