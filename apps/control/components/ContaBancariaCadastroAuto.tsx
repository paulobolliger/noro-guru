import { useState } from 'react';
import { buscarBanco } from '@/apps/financeiro/lib/brasilapi';
import { useAutoPreenchimentoBrasilAPI } from '@/apps/financeiro/lib/useAutoPreenchimentoBrasilAPI';

export default function ContaBancariaCadastroAuto() {
  const [form, setForm] = useState({
    codigoBanco: '',
    nomeBanco: '',
    agencia: '',
    conta: '',
    cep: '',
    rua: '',
    bairro: '',
    cidade: '',
    estado: '',
  });
  const { preencherEnderecoPorCep, loading, erro } = useAutoPreenchimentoBrasilAPI();

  async function handleBancoBlur() {
    if (form.codigoBanco.length >= 3) {
      try {
        const banco = await buscarBanco(form.codigoBanco);
        setForm(f => ({ ...f, nomeBanco: banco.name }));
      } catch (e) {
        // erro banco
      }
    }
  }

  async function handleCepBlur() {
    if (form.cep.length >= 8) {
      const endereco = await preencherEnderecoPorCep(form.cep);
      if (endereco) {
        setForm(f => ({ ...f, ...endereco }));
      }
    }
  }

  return (
    <form className="space-y-4 p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-2">Cadastro de Conta Bancária com Auto-preenchimento</h2>
      <div>
        <label>Código do Banco:</label>
        <input type="text" value={form.codigoBanco} onChange={e => setForm(f => ({ ...f, codigoBanco: e.target.value }))} onBlur={handleBancoBlur} className="input" />
      </div>
      <div>
        <label>Nome do Banco:</label>
        <input type="text" value={form.nomeBanco} onChange={e => setForm(f => ({ ...f, nomeBanco: e.target.value }))} className="input" />
      </div>
      <div>
        <label>Agência:</label>
        <input type="text" value={form.agencia} onChange={e => setForm(f => ({ ...f, agencia: e.target.value }))} className="input" />
      </div>
      <div>
        <label>Conta:</label>
        <input type="text" value={form.conta} onChange={e => setForm(f => ({ ...f, conta: e.target.value }))} className="input" />
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
      <button type="submit" className="btn-primary mt-4">Salvar Conta Bancária</button>
    </form>
  );
}
