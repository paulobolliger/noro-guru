import { redirect } from 'next/navigation';

// /cadastro → app.noro.guru/cadastro (entry point de marketing)
// Por enquanto redireciona para o app. Quando o fluxo de onboarding
// web for implementado, esta página terá o formulário de pré-cadastro.
export default function CadastroPage() {
  redirect('https://app.noro.guru/cadastro');
}
