import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Camera, Upload, X } from 'lucide-react';

interface ImageUploadProps {
  onImageCapture: (imageData: string) => void;
  currentImage?: string;
}

export const ImageUpload = ({ onImageCapture, currentImage }: ImageUploadProps) => {
  const [previewImage, setPreviewImage] = useState<string>(currentImage || '');
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setPreviewImage(imageData);
        onImageCapture(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsCapturing(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setPreviewImage(imageData);
        onImageCapture(imageData);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
  };

  const removeImage = () => {
    setPreviewImage('');
    onImageCapture('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2"
        >
          <Upload size={16} />
          Upload Image
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={startCamera}
          className="flex items-center gap-2"
        >
          <Camera size={16} />
          Take Photo
        </Button>
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {isCapturing && (
        <Card className="p-4">
          <div className="space-y-4">
            <video
              ref={videoRef}
              className="w-full max-w-md mx-auto rounded-md"
              autoPlay
              playsInline
            />
            <div className="flex justify-center gap-2">
              <Button onClick={capturePhoto}>Capture</Button>
              <Button variant="outline" onClick={stopCamera}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      {previewImage && (
        <Card className="p-4">
          <div className="relative">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full max-w-md mx-auto rounded-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={removeImage}
            >
              <X size={16} />
            </Button>
          </div>
        </Card>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};