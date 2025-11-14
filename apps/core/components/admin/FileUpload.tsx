// components/admin/FileUpload.tsx
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  /** Bucket de destino */
  bucket: 'logos' | 'avatars' | 'documents' | 'images' | 'attachments';
  /** Pasta opcional dentro do bucket */
  folder?: string;
  /** Callback quando upload completar com sucesso */
  onUploadComplete?: (url: string, path: string) => void;
  /** Callback para erros */
  onError?: (error: string) => void;
  /** Aceitar tipos de arquivo específicos */
  accept?: string;
  /** Texto do botão */
  buttonText?: string;
  /** Mostrar preview da imagem? */
  showPreview?: boolean;
  /** URL da imagem atual (para mostrar antes do upload) */
  currentImageUrl?: string;
  /** Classe CSS adicional */
  className?: string;
}

export default function FileUpload({
  bucket,
  folder,
  onUploadComplete,
  onError,
  accept,
  buttonText = 'Escolher arquivo',
  showPreview = false,
  currentImageUrl,
  className = '',
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Mostrar preview se for imagem
    if (showPreview && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    // Fazer upload
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setProgress('uploading');
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);
      if (folder) {
        formData.append('folder', folder);
      }

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Erro ao fazer upload');
      }

      setProgress('success');
      if (onUploadComplete) {
        onUploadComplete(result.url, result.path);
      }

      // Resetar após 2 segundos
      setTimeout(() => {
        setProgress('idle');
      }, 2000);

    } catch (error: any) {
      console.error('[FileUpload] Error:', error);
      setProgress('error');
      setErrorMessage(error.message);
      if (onError) {
        onError(error.message);
      }

      // Resetar após 3 segundos
      setTimeout(() => {
        setProgress('idle');
        setErrorMessage('');
      }, 3000);

    } finally {
      setUploading(false);
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearPreview = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`file-upload ${className}`}>
      {/* Preview da imagem */}
      {showPreview && previewUrl && (
        <div className="mb-3 relative inline-block">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
          />
          {!uploading && (
            <button
              type="button"
              onClick={clearPreview}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {/* Input de arquivo (hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
        disabled={uploading}
      />

      {/* Botão de upload */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-lg
          transition-all duration-200
          ${uploading
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
          }
          ${progress === 'success' ? 'bg-green-600 hover:bg-green-700' : ''}
          ${progress === 'error' ? 'bg-red-600 hover:bg-red-700' : ''}
        `}
      >
        {progress === 'idle' && (
          <>
            <Upload size={18} />
            {buttonText}
          </>
        )}
        {progress === 'uploading' && (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            Enviando...
          </>
        )}
        {progress === 'success' && (
          <>
            <CheckCircle size={18} />
            Enviado com sucesso!
          </>
        )}
        {progress === 'error' && (
          <>
            <AlertCircle size={18} />
            Erro no upload
          </>
        )}
      </button>

      {/* Mensagem de erro */}
      {errorMessage && (
        <p className="mt-2 text-sm text-red-600">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
