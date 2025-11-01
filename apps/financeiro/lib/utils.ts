import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Moeda } from '@noro/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, currency: Moeda = 'BRL') {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
  }).format(value)
}
