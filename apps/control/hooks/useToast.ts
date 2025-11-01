// hooks/useToast.ts
'use client';

import { toast } from '@/stores/toastStore';

export function useToast() {
  return {
    success: toast.success,
    error: toast.error,
    warning: toast.warning,
    info: toast.info,
    custom: toast.custom,
  };
}
