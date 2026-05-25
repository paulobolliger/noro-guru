import { redirect } from 'next/navigation';

// /case-studies foi substituída por /cases — redirect permanente
export default function CaseStudiesPage() {
  redirect('/cases');
}
