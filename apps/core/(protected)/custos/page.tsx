// apps/core/(protected)/custos/page.tsx
import { redirect } from 'next/navigation';

export default function CustosPage() {
  redirect('/admin/custos/all');
}
