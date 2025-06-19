import React from "react";
import { ArrowBigLeft } from "lucide-react";
import { photoCapturedDataType } from "@/types/types";

interface GalleryModalProps {
  isOpen: boolean;
  downloadPhoto: (data: photoCapturedDataType) => void;
  onClose: () => void;
  photos: string[];
  currentPhoto: photoCapturedDataType | null;
}

const GalleryModal = ({
  isOpen,
  downloadPhoto,
  onClose,
  photos,
  currentPhoto,
}: GalleryModalProps) => {
  
  if (!currentPhoto) return; 
  
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50"
      style={{ display: isOpen ? "flex" : "none" }}
    >
     <div className="relative bg-black max-w-2xl w-full flex justify-center items-center mx-auto flex-col gap-y-2 p-5 rounded-md">
        <div className="flex justify-start items-start w-full">
          <ArrowBigLeft onClick={() => onClose()} className="text-white cursor-pointer hover:scale-125 transition-all"/>
        </div>
         <div className={`flex flex-col bg-white w-[max-content] justify-center items-center relative group rounded-[2px] ${currentPhoto?.frame.name === "None" ? "bg-white px-4 pt-2" : currentPhoto?.frame.style}`}>
            <img
              src={currentPhoto?.image || "placeholder.png"}
              alt=""
              style={{
                filter: currentPhoto?.filter,
                transform: currentPhoto?.mirror ? "scaleX(1)" : "scaleX(-1)"
              }}
              className={`w-80 h-92 object-cover cursor-pointer`}
            />
            <span className={`w-full text-center random-words py-5`}>{currentPhoto?.loveWord}</span>
          </div>
          <button onClick={() => downloadPhoto(currentPhoto)} className="text-black bg-white cursor-pointer">
            download
          </button>
     </div>
    </div>
  );
};

export default GalleryModal;
