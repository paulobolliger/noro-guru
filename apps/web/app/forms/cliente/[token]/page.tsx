// app/forms/cliente/[token]/page.tsx
import { getClientByUpdateToken } from '@/app/admin/(protected)/clientes/[id]/actions';
import { notFound } from 'next/navigation';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
// Importa o formulário do cliente
import ClientUpdateForm from "@/components/forms/ClientUpdateForm";

interface PageProps {
  params: {
    token: string;
  };
}

// Componente para exibir mensagens de erro ou status
function StatusMessage({ type, message }: { type: 'error' | 'success'; message: string }) {
  const isError = type === 'error';
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center`}>
      <div className="bg-white p-10 rounded-2xl shadow-xl">
        {isError ? (
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        ) : (
          <ShieldCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
        )}
        <h1 className={`text-2xl font-bold ${isError ? 'text-red-700' : 'text-green-700'}`}>
          {isError ? 'Acesso Inválido' : 'Sucesso'}
        </h1>
        <p className="mt-2 text-gray-600 max-w-sm">{message}</p>
      </div>
    </div>
  );
}


export default async function ClientUpdatePage({ params }: PageProps) {
  const { token } = params;

  if (!token) {
    notFound();
  }

  // 1. Valida o token no lado do servidor
  const result = await getClientByUpdateToken(token);

  // 2. Trata os casos de erro (token inválido, expirado, etc.)
  if (!result.success) {
    return <StatusMessage type="error" message={result.error || 'Ocorreu um erro desconhecido.'} />;
  }

  const cliente = result.data;
  if (!cliente) {
    return <StatusMessage type="error" message="Não foi possível encontrar os dados do cliente associados a este link." />;
  }
  
  // 3. Se tudo estiver correto, renderiza a página com o formulário
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
            {/* Pode adicionar o seu logo aqui */}
            <h1 className="text-3xl font-bold text-gray-800">Atualização de Cadastro</h1>
            <p className="text-gray-600 mt-2">Olá, {cliente.nome}! Por favor, confirme ou atualize os seus dados abaixo.</p>
        </header>
        
        <main className="bg-white p-8 rounded-2xl shadow-lg">
            {/* Renderiza o novo componente de formulário, passando os dados do cliente e o token */}
            <ClientUpdateForm cliente={cliente} token={token} />
        </main>
      </div>
    </div>
  );
}