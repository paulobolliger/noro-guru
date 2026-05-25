import { redirect } from 'next/navigation';

// /suporte foi substituída por /ajuda — redirect permanente
export default function SuportePage() {
  redirect('/ajuda');
}
