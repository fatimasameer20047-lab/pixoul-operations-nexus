import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, File } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  accept?: string;
  className?: string;
}

export const FileUpload = ({ onFileSelect, selectedFile, accept = "*/*", className }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    onFileSelect(file || null);
  };

  const removeFile = () => {
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isImage = selectedFile?.type.startsWith('image/');

  return (
    <div className={className}>
      <div className="flex gap-2 mb-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2"
        >
          <Upload size={16} />
          Choose File
        </Button>
        
        {selectedFile && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={removeFile}
          >
            <X size={16} />
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {selectedFile && (
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <File size={16} />
              <span className="text-sm font-medium">{selectedFile.name}</span>
              <span className="text-xs text-muted-foreground">
                ({(selectedFile.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            
            {isImage && (
              <div className="mt-3">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="max-w-full h-auto max-h-48 rounded border"
                />
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};