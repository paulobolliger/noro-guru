import { Suspense } from 'react';
import { DuplicatasPagarClient } from './duplicatas-pagar-client';
import { getCurrentTenantId } from '@/lib/tenant';

// Metadata
export const metadata = {
  title: 'Duplicatas a Pagar | Noro Guru',
  description: 'Gestão de duplicatas a pagar',
};

async function getDuplicatasPagar() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/duplicatas-pagar`, {
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

async function getFornecedores() {
  // TODO: Implementar busca de fornecedores
  return [];
}

async function getAdiantamentos() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/adiantamentos?com_saldo=true`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return [];
    }
    
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Erro ao buscar adiantamentos:', error);
    return [];
  }
}

async function getCreditos() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/creditos?com_saldo=true`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return [];
    }
    
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Erro ao buscar créditos:', error);
    return [];
  }
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

export default async function DuplicatasPagarPage() {
  const tenantId = await getCurrentTenantId();
  const [duplicatas, fornecedores, adiantamentos, creditos, categorias, contas] = await Promise.all([
    getDuplicatasPagar(),
    getFornecedores(),
    getAdiantamentos(),
    getCreditos(),
    getCategorias(),
    getContasBancarias(),
  ]);

  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<div>Carregando...</div>}>
        <DuplicatasPagarClient
          duplicatas={duplicatas}
          fornecedores={fornecedores}
          adiantamentos={adiantamentos}
          creditos={creditos}
          categorias={categorias}
          contas={contas}
          tenantId={tenantId}
        />
      </Suspense>
    </div>
  );
}
