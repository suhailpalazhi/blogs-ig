'use client';

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check } from 'lucide-react';

interface Point { x: number; y: number }
interface Area { x: number; y: number; width: number; height: number }

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImageBlob: Blob) => void;
  onCancel: () => void;
  aspect?: number;
  circularCrop?: boolean;
}

export default function ImageCropper({ imageSrc, onCropComplete, onCancel, aspect = 1, circularCrop = false }: ImageCropperProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropCompleteInternal = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
  ): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((file) => {
        if (file) {
          resolve(file);
        } else {
          reject(new Error('Canvas is empty'));
        }
      }, 'image/jpeg');
    });
  };

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedBlob);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white/90 glass-panel rounded-[2rem] overflow-hidden flex flex-col shadow-2xl relative">
        <div className="p-6 border-b border-primary/10 flex justify-between items-center">
          <h3 className="font-playfair text-2xl font-bold text-text">Crop Image</h3>
          <button onClick={onCancel} className="text-text/60 hover:text-red-500 transition-colors p-2 bg-white rounded-full shadow-sm hover:shadow-md">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="relative w-full h-[50vh] sm:h-[60vh] bg-black/5">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={circularCrop ? 'round' : 'rect'}
            showGrid={!circularCrop}
            onCropChange={setCrop}
            onCropComplete={onCropCompleteInternal}
            onZoomChange={setZoom}
          />
        </div>
        
        <div className="p-6 flex flex-col space-y-4 bg-white/80 backdrop-blur-md">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-text/60 min-w-12">Zoom</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => {
                setZoom(Number(e.target.value));
              }}
              className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
          <div className="flex justify-end space-x-4 pt-2">
            <button
              onClick={onCancel}
              className="px-6 py-2.5 bg-white border border-primary/20 text-text/80 font-bold rounded-xl shadow-sm hover:bg-white/80 hover:shadow-md transition-all focus:outline-none flex items-center"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-gradient-to-r from-primary to-cta text-white font-bold rounded-xl shadow-[0_4px_14px_rgba(236,72,153,0.3)] hover:shadow-[0_6px_20px_rgba(236,72,153,0.4)] transition-all focus:outline-none flex items-center space-x-2 transform hover:-translate-y-0.5"
            >
              <Check className="w-5 h-5" />
              <span>Apply Crop</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
