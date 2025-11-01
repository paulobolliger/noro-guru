import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redireciona para a área protegida
  redirect('/dashboard')
}
