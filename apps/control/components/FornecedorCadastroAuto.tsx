import { useState } from 'react';
import { useAutoPreenchimentoBrasilAPI } from '@/apps/financeiro/lib/useAutoPreenchimentoBrasilAPI';

export default function FornecedorCadastroAuto() {
  const [form, setForm] = useState({
    nome: '',
    cnpj: '',
    cep: '',
    rua: '',
    bairro: '',
    cidade: '',
    estado: '',
    telefone: '',
    fantasia: '',
  });
  const { preencherEnderecoPorCep, preencherEmpresaPorCnpj, loading, erro } = useAutoPreenchimentoBrasilAPI();

  async function handleCepBlur() {
    if (form.cep.length >= 8) {
      const endereco = await preencherEnderecoPorCep(form.cep);
      if (endereco) {
        setForm(f => ({ ...f, ...endereco }));
      }
    }
  }

  async function handleCnpjBlur() {
    if (form.cnpj.length >= 14) {
      const empresa = await preencherEmpresaPorCnpj(form.cnpj);
      if (empresa) {
        setForm(f => ({
          ...f,
          nome: empresa.nome,
          fantasia: empresa.fantasia,
          telefone: empresa.telefone,
          cep: empresa.cep,
          rua: empresa.endereco,
          bairro: empresa.bairro,
          cidade: empresa.cidade,
          estado: empresa.estado,
        }));
      }
    }
  }

  return (
    <form className="space-y-4 p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-2">Cadastro de Fornecedor com Auto-preenchimento</h2>
      <div>
        <label>CNPJ:</label>
        <input type="text" value={form.cnpj} onChange={e => setForm(f => ({ ...f, cnpj: e.target.value }))} onBlur={handleCnpjBlur} className="input" />
      </div>
      <div>
        <label>Nome:</label>
        <input type="text" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} className="input" />
      </div>
      <div>
        <label>Nome Fantasia:</label>
        <input type="text" value={form.fantasia} onChange={e => setForm(f => ({ ...f, fantasia: e.target.value }))} className="input" />
      </div>
      <div>
        <label>Telefone:</label>
        <input type="text" value={form.telefone} onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))} className="input" />
      </div>
      <div>
        <label>CEP:</label>
        <input type="text" value={form.cep} onChange={e => setForm(f => ({ ...f, cep: e.target.value }))} onBlur={handleCepBlur} className="input" />
      </div>
      <div>
        <label>Rua:</label>
        <input type="text" value={form.rua} onChange={e => setForm(f => ({ ...f, rua: e.target.value }))} className="input" />
      </div>
      <div>
        <label>Bairro:</label>
        <input type="text" value={form.bairro} onChange={e => setForm(f => ({ ...f, bairro: e.target.value }))} className="input" />
      </div>
      <div>
        <label>Cidade:</label>
        <input type="text" value={form.cidade} onChange={e => setForm(f => ({ ...f, cidade: e.target.value }))} className="input" />
      </div>
      <div>
        <label>Estado:</label>
        <input type="text" value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value }))} className="input" />
      </div>
      {loading && <div className="text-blue-500">Buscando dados...</div>}
      {erro && <div className="text-red-500">{erro}</div>}
      <button type="submit" className="btn-primary mt-4">Salvar Fornecedor</button>
    </form>
  );
}
