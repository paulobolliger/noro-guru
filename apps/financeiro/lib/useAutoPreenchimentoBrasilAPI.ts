import { useState } from 'react';
import { buscarCep, buscarCnpj } from './brasilapi';

export function useAutoPreenchimentoBrasilAPI() {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function preencherEnderecoPorCep(cep: string) {
    setLoading(true);
    setErro(null);
    try {
      const data = await buscarCep(cep);
      setLoading(false);
      return {
        rua: data.street,
        bairro: data.neighborhood,
        cidade: data.city,
        estado: data.state,
        cep: data.cep,
      };
    } catch (e: any) {
      setLoading(false);
      setErro(e.message);
      return null;
    }
  }

  async function preencherEmpresaPorCnpj(cnpj: string) {
    setLoading(true);
    setErro(null);
    try {
      const data = await buscarCnpj(cnpj);
      setLoading(false);
      return {
        nome: data.razao_social,
        fantasia: data.nome_fantasia,
        cnpj: data.cnpj,
        endereco: data.descricao_situacao_cadastral,
        bairro: data.bairro,
        cidade: data.municipio,
        estado: data.uf,
        cep: data.cep,
        telefone: data.ddd_telefone_1,
      };
    } catch (e: any) {
      setLoading(false);
      setErro(e.message);
      return null;
    }
  }

  return {
    loading,
    erro,
    preencherEnderecoPorCep,
    preencherEmpresaPorCnpj,
  };
}
