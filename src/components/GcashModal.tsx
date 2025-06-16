import { X } from 'lucide-react';
import React from 'react'


interface GcashModalProps {
  isOpen: boolean;  
  onClose: () => void;
}

const GcashModal = ({ isOpen, onClose } : GcashModalProps) => {
  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 px-4'>
      <div className="relative flex justify-center items-center flex-col max-w-md w-full bg-white rounded-2xl p-10">
        <X onClick={onClose} className='absolute top-4 right-4 text-black cursor-pointer hover:scale-125 transition-all' />
        <h1 className="text-2xl font-bold text-center mb-2">Support Our Photo Booth 🎉</h1>
        <p className="text-sm text-gray-600 text-center mb-4 px-2">
          Your donation helps us keep the fun going! Scan the QR code below using the GCash app to send your support.
        </p>
        <img src="/gcash.jpg" alt="" className='h-96' />
      </div>
    </div>
  )
}

export default GcashModal
