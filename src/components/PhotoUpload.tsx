'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface PhotoUploadProps {
  propertyId: string;
  onUploadComplete: (photo: { id: string; url: string }) => void;
  existingPhotos?: Array<{ id: string; url: string }>;
}

export default function PhotoUpload({ propertyId, onUploadComplete, existingPhotos = [] }: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      uploadFiles(files);
    }
  }, [propertyId]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      uploadFiles(files);
    }
  }, [propertyId]);

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Oturum açılmamış');
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('propertyId', propertyId);

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error('Yükleme başarısız');
        }

        const result = await response.json();
        onUploadComplete(result.data);
        
        setUploadProgress(((i + 1) / files.length) * 100);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Dosya yüklenirken hata oluştu');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <motion.div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-primary-gold bg-primary-gold/10' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        
        <div className="space-y-4">
          <motion.div
            animate={{ rotate: isUploading ? 360 : 0 }}
            transition={{ duration: 2, repeat: isUploading ? Infinity : 0, ease: "linear" }}
          >
            {isUploading ? (
              <Loader2 className="w-12 h-12 mx-auto text-primary-gold" />
            ) : (
              <Upload className="w-12 h-12 mx-auto text-gray-400" />
            )}
          </motion.div>
          
          <div>
            {isUploading ? (
              <div className="space-y-2">
                <p className="text-primary-gold font-medium">Yükleniyor...</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-gold h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500">{Math.round(uploadProgress)}%</p>
              </div>
            ) : (
              <>
                <p className="text-lg font-medium text-gray-700">
                  Fotoğrafları sürükleyip bırakın veya tıklayın
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, JPEG formatları desteklenir
                </p>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Existing Photos Preview */}
      {existingPhotos.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-charcoal">Mevcut Fotoğraflar</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {existingPhotos.map((photo) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={photo.url}
                      alt="Property photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <button
                      onClick={() => {/* Handle delete */}}
                      className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}