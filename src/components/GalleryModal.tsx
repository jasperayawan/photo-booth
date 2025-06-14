import React from "react";
import { ArrowBigLeft } from "lucide-react";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: string[];
  currentPhoto: string | null;
}

const GalleryModal = ({
  isOpen,
  onClose,
  photos,
  currentPhoto,
}: GalleryModalProps) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50"
      style={{ display: isOpen ? "flex" : "none" }}
    >
     <div className="relative flex flex-col gap-y-2">
        <ArrowBigLeft onClick={() => onClose()} className="text-white cursor-pointer hover:scale-125 transition-all"/>
            <img
                src={currentPhoto || "/placeholder-image.png"}
                alt=""
                width={100}
                height={100}
                className="rounded-md max-w-2xl w-full object-cover"
            />
     </div>
    </div>
  );
};

export default GalleryModal;
