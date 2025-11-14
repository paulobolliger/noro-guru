/**
 * useErrorHandler Hook
 *
 * Padroniza o tratamento de erros e feedback de sucesso na aplicação.
 * Usa o sistema de toast para notificações consistentes e acessíveis.
 *
 * @example
 * ```tsx
 * const { handleError, handleSuccess } = useErrorHandler();
 *
 * try {
 *   await someAsyncOperation();
 *   handleSuccess('Operação realizada com sucesso!');
 * } catch (error) {
 *   handleError(error, 'Operação Falhou');
 * }
 * ```
 */

'use client';

import { useToast } from '@/components/ui/use-toast';
import { useCallback } from 'react';

export interface ErrorHandlerOptions {
  /**
   * Contexto onde o erro ocorreu (ex: "Criar Lead", "Atualizar Cliente")
   * Usado para logging e debugging
   */
  context?: string;

  /**
   * Mensagem customizada para o usuário
   * Se não fornecida, usa uma mensagem genérica
   */
  userMessage?: string;

  /**
   * Se true, loga o erro completo no console
   * Default: true em desenvolvimento, false em produção
   */
  logError?: boolean;

  /**
   * Duração do toast em milissegundos
   * Default: 5000ms
   */
  duration?: number;
}

export interface SuccessHandlerOptions {
  /**
   * Duração do toast em milissegundos
   * Default: 3000ms
   */
  duration?: number;

  /**
   * Descrição adicional (opcional)
   */
  description?: string;
}

export function useErrorHandler() {
  const { toast } = useToast();

  /**
   * Trata erros de forma consistente
   */
  const handleError = useCallback(
    (error: unknown, options?: ErrorHandlerOptions | string) => {
      // Permite passar string direto como contexto
      const opts: ErrorHandlerOptions = typeof options === 'string'
        ? { context: options }
        : options || {};

      const {
        context = 'Operação',
        userMessage,
        logError = process.env.NODE_ENV === 'development',
        duration = 5000,
      } = opts;

      // Log detalhado do erro (apenas em dev)
      if (logError) {
        console.error(`[${context}]`, error);

        // Log adicional para erros com stack trace
        if (error instanceof Error) {
          console.error('Stack:', error.stack);
        }
      }

      // Determina a mensagem para o usuário
      let displayMessage = userMessage || 'Ocorreu um erro. Tente novamente.';

      // Extrai mensagem de erro se for um Error object
      if (!userMessage && error instanceof Error) {
        // Verifica se é um erro conhecido/tratável
        if (error.message.includes('Failed to fetch')) {
          displayMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
        } else if (error.message.includes('Network request failed')) {
          displayMessage = 'Erro de rede. Tente novamente.';
        } else if (error.message.includes('timeout')) {
          displayMessage = 'A operação demorou muito. Tente novamente.';
        }
      }

      // Exibe toast de erro
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: displayMessage,
        duration,
      });

      return displayMessage;
    },
    [toast]
  );

  /**
   * Exibe mensagem de sucesso
   */
  const handleSuccess = useCallback(
    (message: string, options?: SuccessHandlerOptions) => {
      const { duration = 3000, description } = options || {};

      toast({
        title: 'Sucesso',
        description: description || message,
        duration,
        className: 'bg-green-50 border-green-200',
      });
    },
    [toast]
  );

  /**
   * Exibe mensagem de info
   */
  const handleInfo = useCallback(
    (message: string, options?: { duration?: number; description?: string }) => {
      const { duration = 4000, description } = options || {};

      toast({
        title: 'Informação',
        description: description || message,
        duration,
        className: 'bg-blue-50 border-blue-200',
      });
    },
    [toast]
  );

  /**
   * Exibe mensagem de aviso
   */
  const handleWarning = useCallback(
    (message: string, options?: { duration?: number; description?: string }) => {
      const { duration = 4000, description } = options || {};

      toast({
        title: 'Atenção',
        description: description || message,
        duration,
        className: 'bg-yellow-50 border-yellow-200',
      });
    },
    [toast]
  );

  /**
   * Wrapper para operações assíncronas com tratamento de erro automático
   */
  const withErrorHandling = useCallback(
    <T,>(
      operation: () => Promise<T>,
      options?: ErrorHandlerOptions
    ): Promise<T | null> => {
      return operation().catch((error) => {
        handleError(error, options);
        return null;
      });
    },
    [handleError]
  );

  return {
    handleError,
    handleSuccess,
    handleInfo,
    handleWarning,
    withErrorHandling,
  };
}

/**
 * Tipos de erro comuns da aplicação
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Não autenticado') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = 'Sem permissão') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Erro de rede') {
    super(message);
    this.name = 'NetworkError';
  }
}
