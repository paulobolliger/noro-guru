import { redirect } from 'next/navigation';

// /contact foi substituída por /demo — redirect permanente
export default function ContactPage() {
  redirect('/demo');
}
