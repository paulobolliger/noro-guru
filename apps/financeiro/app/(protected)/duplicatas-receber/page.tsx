import { Suspense } from 'react';
import { DuplicatasReceberClient } from './duplicatas-receber-client';
import { getCurrentTenantId } from '@/lib/tenant';

// Metadata
export const metadata = {
  title: 'Duplicatas a Receber | Noro Guru',
  description: 'Gestão de duplicatas a receber',
};

async function getDuplicatasReceber() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/duplicatas-receber`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error('Erro ao buscar duplicatas:', response.statusText);
      return [];
    }
    
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Erro ao buscar duplicatas:', error);
    return [];
  }
}

async function getClientes() {
  // TODO: Implementar busca de clientes
  return [];
}

async function getCategorias() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/categorias`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return [];
    }
    
    const result = await response.json();
    return result || [];
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return [];
  }
}

async function getContasBancarias() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/bancos`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return [];
    }
    
    const result = await response.json();
    return result || [];
  } catch (error) {
    console.error('Erro ao buscar contas bancárias:', error);
    return [];
  }
}

export default async function DuplicatasReceberPage() {
  const tenantId = await getCurrentTenantId();
  const [duplicatas, clientes, categorias, contas] = await Promise.all([
    getDuplicatasReceber(),
    getClientes(),
    getCategorias(),
    getContasBancarias(),
  ]);

  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<div>Carregando...</div>}>
        <DuplicatasReceberClient
          duplicatas={duplicatas}
          clientes={clientes}
          categorias={categorias}
          contas={contas}
          tenantId={tenantId}
        />
      </Suspense>
    </div>
  );
}
