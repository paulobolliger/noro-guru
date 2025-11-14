/**
 * useFormValidation Hook
 *
 * Hook para validação de formulários com Zod em tempo real.
 * Fornece validação de campo individual e do formulário completo.
 *
 * @example
 * ```tsx
 * const schema = z.object({
 *   email: z.string().email('Email inválido'),
 *   nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
 * });
 *
 * const { values, errors, handleChange, handleSubmit, isValid } = useFormValidation({
 *   schema,
 *   initialValues: { email: '', nome: '' },
 *   onSubmit: async (data) => {
 *     await createUser(data);
 *   },
 * });
 * ```
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { z } from 'zod';

export interface UseFormValidationOptions<T extends z.ZodTypeAny> {
  /**
   * Schema Zod para validação
   */
  schema: T;

  /**
   * Valores iniciais do formulário
   */
  initialValues: z.infer<T>;

  /**
   * Callback quando formulário é submetido com sucesso
   */
  onSubmit: (data: z.infer<T>) => void | Promise<void>;

  /**
   * Modo de validação
   * - onBlur: valida quando campo perde foco (padrão)
   * - onChange: valida em tempo real
   * - onSubmit: valida apenas no submit
   */
  mode?: 'onBlur' | 'onChange' | 'onSubmit';

  /**
   * Se true, revalida campos já tocados em onChange
   * Default: true
   */
  reValidateMode?: boolean;
}

export interface FieldState {
  /**
   * Se o campo foi tocado (blur foi executado)
   */
  touched: boolean;

  /**
   * Se o campo foi modificado
   */
  dirty: boolean;
}

export function useFormValidation<T extends z.ZodTypeAny>({
  schema,
  initialValues,
  onSubmit,
  mode = 'onBlur',
  reValidateMode = true,
}: UseFormValidationOptions<T>) {
  type FormData = z.infer<T>;
  type FormErrors = Partial<Record<keyof FormData, string>>;
  type FieldStates = Record<keyof FormData, FieldState>;

  // Estados
  const [values, setValues] = useState<FormData>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({} as FormErrors);
  const [fieldStates, setFieldStates] = useState<FieldStates>(() => {
    const states = {} as FieldStates;
    Object.keys(initialValues).forEach((key) => {
      states[key as keyof FormData] = { touched: false, dirty: false };
    });
    return states;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  /**
   * Valida um campo específico
   */
  const validateField = useCallback(
    (name: keyof FormData, value: any): string | undefined => {
      try {
        // Usa safeParse para validar apenas o campo específico
        const fieldSchema = schema.shape[name as string];
        if (fieldSchema) {
          fieldSchema.parse(value);
        }
        return undefined;
      } catch (error) {
        if (error instanceof z.ZodError) {
          return error.errors[0]?.message;
        }
        return 'Erro de validação';
      }
    },
    [schema]
  );

  /**
   * Valida o formulário completo
   */
  const validateForm = useCallback((): boolean => {
    try {
      schema.parse(values);
      setErrors({} as FormErrors);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {} as FormErrors;
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof FormData;
          if (field) {
            newErrors[field] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [schema, values]);

  /**
   * Handler de mudança de valor
   */
  const handleChange = useCallback(
    (name: keyof FormData, value: any) => {
      setValues((prev) => ({ ...prev, [name]: value }));

      // Marca campo como dirty
      setFieldStates((prev) => ({
        ...prev,
        [name]: { ...prev[name], dirty: true },
      }));

      // Valida em tempo real se mode === 'onChange' ou se já foi tocado e reValidateMode === true
      if (mode === 'onChange' || (reValidateMode && fieldStates[name]?.touched)) {
        const error = validateField(name, value);
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    },
    [mode, reValidateMode, fieldStates, validateField]
  );

  /**
   * Handler de blur
   */
  const handleBlur = useCallback(
    (name: keyof FormData) => {
      // Marca campo como touched
      setFieldStates((prev) => ({
        ...prev,
        [name]: { ...prev[name], touched: true },
      }));

      // Valida no blur se mode === 'onBlur'
      if (mode === 'onBlur') {
        const error = validateField(name, values[name]);
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    },
    [mode, values, validateField]
  );

  /**
   * Handler de submit
   */
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      setSubmitCount((prev) => prev + 1);

      // Marca todos os campos como touched
      setFieldStates((prev) => {
        const newStates = { ...prev };
        Object.keys(newStates).forEach((key) => {
          newStates[key as keyof FormData] = {
            ...newStates[key as keyof FormData],
            touched: true,
          };
        });
        return newStates;
      });

      // Valida formulário completo
      const isValid = validateForm();

      if (!isValid) {
        return;
      }

      // Executa onSubmit
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Erro ao submeter formulário:', error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateForm, onSubmit]
  );

  /**
   * Reseta o formulário
   */
  const reset = useCallback(
    (newValues?: Partial<FormData>) => {
      setValues(newValues ? { ...initialValues, ...newValues } : initialValues);
      setErrors({} as FormErrors);
      setFieldStates(() => {
        const states = {} as FieldStates;
        Object.keys(initialValues).forEach((key) => {
          states[key as keyof FormData] = { touched: false, dirty: false };
        });
        return states;
      });
      setSubmitCount(0);
    },
    [initialValues]
  );

  /**
   * Define valores do formulário
   */
  const setFormValues = useCallback((newValues: Partial<FormData>) => {
    setValues((prev) => ({ ...prev, ...newValues }));
  }, []);

  /**
   * Define erro em um campo específico
   */
  const setFieldError = useCallback((name: keyof FormData, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  /**
   * Limpa erro de um campo específico
   */
  const clearFieldError = useCallback((name: keyof FormData) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  /**
   * Retorna helper para criar onChange handler
   */
  const getFieldProps = useCallback(
    (name: keyof FormData) => ({
      name: String(name),
      value: values[name],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        handleChange(name, e.target.value);
      },
      onBlur: () => handleBlur(name),
      error: errors[name],
    }),
    [values, errors, handleChange, handleBlur]
  );

  // Computed values
  const isValid = Object.keys(errors).length === 0;
  const isDirty = Object.values(fieldStates).some((state) => state.dirty);
  const touchedFields = Object.entries(fieldStates)
    .filter(([_, state]) => state.touched)
    .map(([key]) => key as keyof FormData);

  return {
    // Estados
    values,
    errors,
    fieldStates,
    isSubmitting,
    submitCount,

    // Computed
    isValid,
    isDirty,
    touchedFields,

    // Handlers
    handleChange,
    handleBlur,
    handleSubmit,
    reset,

    // Utilities
    setFormValues,
    setFieldError,
    clearFieldError,
    getFieldProps,
    validateField,
    validateForm,
  };
}

/**
 * Hook simplificado para formulários simples sem schema Zod
 */
export interface UseSimpleFormOptions<T> {
  initialValues: T;
  onSubmit: (data: T) => void | Promise<void>;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
}

export function useSimpleForm<T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validate,
}: UseSimpleFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Limpa erro quando usuário digita
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      // Valida se função foi fornecida
      if (validate) {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Erro ao submeter formulário:', error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const getFieldProps = useCallback(
    (name: keyof T) => ({
      name: String(name),
      value: values[name],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        handleChange(name, e.target.value);
      },
      error: errors[name],
    }),
    [values, errors, handleChange]
  );

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
    getFieldProps,
  };
}
