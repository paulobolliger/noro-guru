/**
 * FileUpload Component
 *
 * Componente de upload de arquivos com drag & drop, preview e validação.
 * Suporta múltiplos arquivos, tipos customizados e progresso de upload.
 *
 * @example
 * ```tsx
 * <FileUpload
 *   accept="image/*"
 *   maxSize={5 * 1024 * 1024} // 5MB
 *   maxFiles={3}
 *   onFilesChange={(files) => setFiles(files)}
 *   onUpload={async (file) => await uploadToServer(file)}
 * />
 * ```
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Upload,
  File,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  X,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export interface FileWithPreview extends File {
  preview?: string;
  progress?: number;
  status?: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  id?: string;
}

export interface FileUploadProps {
  /**
   * Arquivos já selecionados
   */
  files?: FileWithPreview[];

  /**
   * Callback quando arquivos mudam
   */
  onFilesChange?: (files: FileWithPreview[]) => void;

  /**
   * Callback para upload (retorna URL ou ID do arquivo)
   */
  onUpload?: (file: FileWithPreview) => Promise<string | void>;

  /**
   * Callback quando arquivo é removido
   */
  onRemove?: (file: FileWithPreview) => void;

  /**
   * Tipos de arquivo aceitos (ex: "image/*", ".pdf", "image/png,image/jpeg")
   */
  accept?: string;

  /**
   * Tamanho máximo por arquivo (em bytes)
   */
  maxSize?: number;

  /**
   * Número máximo de arquivos
   */
  maxFiles?: number;

  /**
   * Se true, permite múltiplos arquivos
   */
  multiple?: boolean;

  /**
   * Se true, desabilita o upload
   */
  disabled?: boolean;

  /**
   * Variante de exibição
   */
  variant?: 'default' | 'compact' | 'gallery';

  /**
   * Label
   */
  label?: string;

  /**
   * Erro
   */
  error?: string;

  /**
   * Se true, campo é obrigatório
   */
  required?: boolean;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function FileUpload({
  files = [],
  onFilesChange,
  onUpload,
  onRemove,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 5,
  multiple = true,
  disabled = false,
  variant = 'default',
  label,
  error,
  required,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [localFiles, setLocalFiles] = React.useState<FileWithPreview[]>(files);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dragCounter = React.useRef(0);

  // Sincroniza com prop externa
  React.useEffect(() => {
    setLocalFiles(files);
  }, [files]);

  // Cleanup URLs de preview
  React.useEffect(() => {
    return () => {
      localFiles.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [localFiles]);

  const validateFile = (file: File): string | null => {
    // Valida tamanho
    if (file.size > maxSize) {
      return `Arquivo muito grande. Máximo: ${formatFileSize(maxSize)}`;
    }

    // Valida tipo
    if (accept) {
      const acceptedTypes = accept.split(',').map((t) => t.trim());
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const fileMimeType = file.type;

      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith('.')) {
          return fileExtension === type.toLowerCase();
        }
        if (type.endsWith('/*')) {
          return fileMimeType.startsWith(type.replace('/*', ''));
        }
        return fileMimeType === type;
      });

      if (!isAccepted) {
        return `Tipo de arquivo não aceito. Aceitos: ${accept}`;
      }
    }

    return null;
  };

  const processFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const newFilesArray = Array.from(fileList);

    // Valida número máximo de arquivos
    if (localFiles.length + newFilesArray.length > maxFiles) {
      alert(`Máximo de ${maxFiles} arquivo(s) permitido(s)`);
      return;
    }

    // Processa cada arquivo
    const processedFiles: FileWithPreview[] = await Promise.all(
      newFilesArray.map(async (file) => {
        const error = validateFile(file);
        const fileWithPreview: FileWithPreview = Object.assign(file, {
          id: Math.random().toString(36).substr(2, 9),
          status: error ? ('error' as const) : ('pending' as const),
          error,
          progress: 0,
        });

        // Cria preview para imagens
        if (file.type.startsWith('image/') && !error) {
          fileWithPreview.preview = URL.createObjectURL(file);
        }

        return fileWithPreview;
      })
    );

    const updatedFiles = [...localFiles, ...processedFiles];
    setLocalFiles(updatedFiles);
    onFilesChange?.(updatedFiles);

    // Inicia upload automático se callback fornecido
    if (onUpload) {
      processedFiles.forEach((file) => {
        if (file.status === 'pending') {
          handleUpload(file);
        }
      });
    }
  };

  const handleUpload = async (file: FileWithPreview) => {
    if (!onUpload) return;

    // Atualiza status para uploading
    updateFileStatus(file.id!, 'uploading', 0);

    try {
      // Simula progresso (se onUpload não fornecer)
      const progressInterval = setInterval(() => {
        updateFileProgress(file.id!, (prev) => Math.min(prev + 10, 90));
      }, 200);

      await onUpload(file);

      clearInterval(progressInterval);
      updateFileStatus(file.id!, 'success', 100);
    } catch (err) {
      updateFileStatus(
        file.id!,
        'error',
        0,
        err instanceof Error ? err.message : 'Erro ao fazer upload'
      );
    }
  };

  const updateFileStatus = (
    id: string,
    status: FileWithPreview['status'],
    progress?: number,
    error?: string
  ) => {
    setLocalFiles((prev) => {
      const updated = prev.map((f) =>
        f.id === id ? { ...f, status, progress, error } : f
      );
      onFilesChange?.(updated);
      return updated;
    });
  };

  const updateFileProgress = (
    id: string,
    progress: number | ((prev: number) => number)
  ) => {
    setLocalFiles((prev) => {
      const updated = prev.map((f) => {
        if (f.id === id) {
          const newProgress =
            typeof progress === 'function' ? progress(f.progress || 0) : progress;
          return { ...f, progress: newProgress };
        }
        return f;
      });
      onFilesChange?.(updated);
      return updated;
    });
  };

  const handleRemove = (file: FileWithPreview) => {
    if (file.preview) {
      URL.revokeObjectURL(file.preview);
    }

    const updated = localFiles.filter((f) => f.id !== file.id);
    setLocalFiles(updated);
    onFilesChange?.(updated);
    onRemove?.(file);
  };

  // Drag & Drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    if (disabled) return;

    const { files: droppedFiles } = e.dataTransfer;
    processFiles(droppedFiles);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // Reset input para permitir selecionar o mesmo arquivo novamente
    e.target.value = '';
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  // Renderiza diferentes variantes
  if (variant === 'compact') {
    return (
      <div className={cn('space-y-2', className)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileInputChange}
            disabled={disabled}
            className="sr-only"
          />

          <button
            type="button"
            onClick={handleClick}
            disabled={disabled || localFiles.length >= maxFiles}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              'border border-gray-300 bg-white text-gray-700',
              'hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <Upload size={16} />
            Escolher Arquivo{multiple ? 's' : ''}
          </button>

          <span className="text-sm text-gray-600">
            {localFiles.length} / {maxFiles} arquivo(s)
          </span>
        </div>

        {/* Lista de arquivos */}
        {localFiles.length > 0 && (
          <div className="space-y-2">
            {localFiles.map((file) => (
              <FileItem
                key={file.id}
                file={file}
                onRemove={handleRemove}
                variant="compact"
              />
            ))}
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'gallery') {
    return (
      <div className={cn('space-y-3', className)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Grid de previews */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {localFiles.map((file) => (
            <FilePreview
              key={file.id}
              file={file}
              onRemove={handleRemove}
            />
          ))}

          {/* Botão de adicionar */}
          {localFiles.length < maxFiles && (
            <button
              type="button"
              onClick={handleClick}
              disabled={disabled}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                'aspect-square border-2 border-dashed rounded-lg transition-colors',
                'flex flex-col items-center justify-center gap-2',
                'hover:border-primary-500 hover:bg-primary-50',
                isDragging
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 bg-gray-50',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Upload size={24} className="text-gray-400" />
              <span className="text-xs text-gray-600">Adicionar</span>
            </button>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          disabled={disabled}
          className="sr-only"
        />

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Drop zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragging
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50',
          disabled && 'opacity-50 cursor-not-allowed hover:border-gray-300 hover:bg-transparent',
          error && 'border-red-500'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          disabled={disabled}
          className="sr-only"
          aria-label="Upload de arquivo"
        />

        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-primary-100 rounded-full">
            <Upload size={32} className="text-primary-600" />
          </div>

          <div>
            <p className="text-base font-medium text-gray-900">
              {isDragging
                ? 'Solte os arquivos aqui'
                : 'Arraste arquivos ou clique para selecionar'}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {accept ? `Aceitos: ${accept}` : 'Qualquer tipo de arquivo'}
              {' • '}
              Máximo: {formatFileSize(maxSize)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {multiple ? `Até ${maxFiles} arquivo(s)` : 'Apenas 1 arquivo'}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de arquivos */}
      {localFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Arquivos selecionados ({localFiles.length})
          </p>
          {localFiles.map((file) => (
            <FileItem key={file.id} file={file} onRemove={handleRemove} />
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * FileItem - Item individual de arquivo
 */
interface FileItemProps {
  file: FileWithPreview;
  onRemove: (file: FileWithPreview) => void;
  variant?: 'default' | 'compact';
}

function FileItem({ file, onRemove, variant = 'default' }: FileItemProps) {
  const icon = getFileIcon(file.type);
  const Icon = icon.component;

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white',
        file.status === 'error' && 'border-red-300 bg-red-50'
      )}
    >
      {/* Preview ou ícone */}
      {file.preview ? (
        <img
          src={file.preview}
          alt={file.name}
          className="w-10 h-10 rounded object-cover flex-shrink-0"
        />
      ) : (
        <div
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded flex-shrink-0',
            icon.bg
          )}
        >
          <Icon size={20} className={icon.color} />
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
        <p className="text-xs text-gray-600">
          {formatFileSize(file.size)}
          {file.status === 'error' && file.error && (
            <span className="text-red-600 ml-2">{file.error}</span>
          )}
        </p>

        {/* Progress bar */}
        {file.status === 'uploading' && (
          <div className="mt-2">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-600 transition-all duration-300"
                style={{ width: `${file.progress || 0}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Status icon */}
      <div className="flex-shrink-0">
        {file.status === 'uploading' && (
          <Loader2 size={20} className="text-primary-600 animate-spin" />
        )}
        {file.status === 'success' && (
          <Check size={20} className="text-green-600" />
        )}
        {file.status === 'error' && (
          <AlertCircle size={20} className="text-red-600" />
        )}
        {(file.status === 'pending' || !file.status) && (
          <button
            type="button"
            onClick={() => onRemove(file)}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            aria-label={`Remover ${file.name}`}
          >
            <X size={16} className="text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * FilePreview - Preview de arquivo para variante gallery
 */
interface FilePreviewProps {
  file: FileWithPreview;
  onRemove: (file: FileWithPreview) => void;
}

function FilePreview({ file, onRemove }: FilePreviewProps) {
  const icon = getFileIcon(file.type);
  const Icon = icon.component;

  return (
    <div className="relative aspect-square group">
      <div
        className={cn(
          'absolute inset-0 rounded-lg border-2 overflow-hidden transition-colors',
          file.status === 'error'
            ? 'border-red-300'
            : file.status === 'success'
            ? 'border-green-300'
            : 'border-gray-200'
        )}
      >
        {/* Preview ou ícone */}
        {file.preview ? (
          <img
            src={file.preview}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={cn('flex items-center justify-center w-full h-full', icon.bg)}>
            <Icon size={40} className={icon.color} />
          </div>
        )}

        {/* Overlay com progresso */}
        {file.status === 'uploading' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center">
              <Loader2 size={32} className="text-white animate-spin mx-auto" />
              <p className="text-white text-sm mt-2">{file.progress || 0}%</p>
            </div>
          </div>
        )}

        {/* Overlay de sucesso */}
        {file.status === 'success' && (
          <div className="absolute top-2 right-2 p-1 bg-green-500 rounded-full">
            <Check size={16} className="text-white" />
          </div>
        )}

        {/* Overlay de erro */}
        {file.status === 'error' && (
          <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
            <AlertCircle size={32} className="text-red-600" />
          </div>
        )}
      </div>

      {/* Botão de remover */}
      <button
        type="button"
        onClick={() => onRemove(file)}
        className={cn(
          'absolute -top-2 -right-2 p-1 bg-white border-2 border-gray-300 rounded-full shadow-sm',
          'opacity-0 group-hover:opacity-100 transition-opacity',
          'hover:bg-red-50 hover:border-red-500'
        )}
        aria-label={`Remover ${file.name}`}
      >
        <X size={16} className="text-gray-600" />
      </button>

      {/* Nome do arquivo */}
      <p className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/75 to-transparent text-white text-xs truncate">
        {file.name}
      </p>
    </div>
  );
}

/**
 * Helpers
 */

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) {
    return {
      component: ImageIcon,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    };
  }
  if (mimeType.startsWith('video/')) {
    return {
      component: Video,
      color: 'text-red-600',
      bg: 'bg-red-100',
    };
  }
  if (mimeType.startsWith('audio/')) {
    return {
      component: Music,
      color: 'text-pink-600',
      bg: 'bg-pink-100',
    };
  }
  if (
    mimeType === 'application/pdf' ||
    mimeType.includes('document') ||
    mimeType.includes('text')
  ) {
    return {
      component: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    };
  }
  return {
    component: File,
    color: 'text-gray-600',
    bg: 'bg-gray-100',
  };
}

/**
 * useFileUpload - Hook para gerenciar upload de arquivos
 */
export interface UseFileUploadOptions {
  /**
   * Tamanho máximo por arquivo
   */
  maxSize?: number;

  /**
   * Número máximo de arquivos
   */
  maxFiles?: number;

  /**
   * Tipos aceitos
   */
  accept?: string;

  /**
   * Callback de upload
   */
  onUpload?: (file: FileWithPreview) => Promise<string | void>;

  /**
   * Arquivos iniciais
   */
  initialFiles?: FileWithPreview[];
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const {
    maxSize = 10 * 1024 * 1024,
    maxFiles = 5,
    accept,
    onUpload,
    initialFiles = [],
  } = options;

  const [files, setFiles] = React.useState<FileWithPreview[]>(initialFiles);
  const [isUploading, setIsUploading] = React.useState(false);
  const [errors, setErrors] = React.useState<string[]>([]);

  const addFiles = React.useCallback(
    (newFiles: File[]) => {
      if (files.length + newFiles.length > maxFiles) {
        setErrors([`Máximo de ${maxFiles} arquivo(s) permitido(s)`]);
        return;
      }

      const processedFiles = newFiles.map((file) => {
        const fileWithPreview: FileWithPreview = Object.assign(file, {
          id: Math.random().toString(36).substr(2, 9),
          status: 'pending' as const,
          progress: 0,
        });

        if (file.type.startsWith('image/')) {
          fileWithPreview.preview = URL.createObjectURL(file);
        }

        return fileWithPreview;
      });

      setFiles((prev) => [...prev, ...processedFiles]);
      setErrors([]);
    },
    [files.length, maxFiles]
  );

  const removeFile = React.useCallback((fileId: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === fileId);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== fileId);
    });
  }, []);

  const uploadAll = React.useCallback(async () => {
    if (!onUpload) return;

    setIsUploading(true);
    const uploadErrors: string[] = [];

    for (const file of files) {
      if (file.status === 'pending') {
        try {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id ? { ...f, status: 'uploading' as const } : f
            )
          );

          await onUpload(file);

          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id ? { ...f, status: 'success' as const, progress: 100 } : f
            )
          );
        } catch (err) {
          const errorMsg =
            err instanceof Error ? err.message : 'Erro ao fazer upload';
          uploadErrors.push(`${file.name}: ${errorMsg}`);

          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id
                ? { ...f, status: 'error' as const, error: errorMsg }
                : f
            )
          );
        }
      }
    }

    setIsUploading(false);
    if (uploadErrors.length > 0) {
      setErrors(uploadErrors);
    }
  }, [files, onUpload]);

  const clearAll = React.useCallback(() => {
    files.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setFiles([]);
    setErrors([]);
  }, [files]);

  const hasErrors = errors.length > 0 || files.some((f) => f.status === 'error');
  const isComplete = files.length > 0 && files.every((f) => f.status === 'success');

  return {
    files,
    setFiles,
    addFiles,
    removeFile,
    uploadAll,
    clearAll,
    isUploading,
    errors,
    hasErrors,
    isComplete,
  };
}
