import { Suspense } from 'react';
import { DuplicatasReceberClient } from './duplicatas-receber-client';

// Metadata
export const metadata = {
  title: 'Duplicatas a Receber | Noro Guru',
  description: 'Gestão de duplicatas a receber',
};

const TENANT_ID = 'd43ef2d2-cbf1-4133-b805-77c3f6444bc2';

async function getDuplicatasReceber() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/duplicatas-receber?tenant_id=${TENANT_ID}`, {
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
    const response = await fetch(`${baseUrl}/api/categorias?tenant_id=${TENANT_ID}`, {
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
    const response = await fetch(`${baseUrl}/api/bancos?tenant_id=${TENANT_ID}`, {
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
          tenantId={TENANT_ID}
        />
      </Suspense>
    </div>
  );
}
