'use client';

import { useState, FormEvent } from 'react';

// --- INTERFACE PARA OS DADOS DO FORMULÁRIO ---
interface FormData {
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
}

// --- COMPONENTE DA PÁGINA ---
export default function ContatoPage() {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    assunto: '',
    mensagem: '',
  });
  const [status, setStatus] = useState<'idle' | 'enviando' | 'sucesso' | 'erro'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('enviando');

    try {
      const response = await fetch('/api/contato', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Falha no envio do lado do servidor.');
      }

      setStatus('sucesso');
      setFormData({ nome: '', email: '', assunto: '', mensagem: '' });
      setTimeout(() => setStatus('idle'), 5000);

    } catch (error) {
      console.error('Erro ao comunicar com a API:', error);
      setStatus('erro');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <main className="pt-20 bg-neutral-dark text-white">
      {/* Cabeçalho da Página */}
      <section className="bg-gradient-to-r from-primary to-primary-dark py-8 text-center text-white">
        <div className="container mx-auto px-5">
          <h1 className="text-4xl font-bold md:text-5xl">Fale Conosco</h1>
          <p className="mt-4 text-lg text-white/90">
            Tem alguma dúvida ou sugestão? Preencha o formulário abaixo ou entre em contato por um dos nossos canais.
          </p>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-5">
          <div className="grid lg:grid-cols-5 gap-12">
            
            {/* Formulário */}
            <div className="lg:col-span-3 rounded-2xl bg-secondary p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Envie a sua mensagem</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-white/70 mb-2">Nome</label>
                  <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required className="w-full rounded-lg border-2 border-white/10 bg-neutral-dark/50 p-3 text-white transition focus:border-primary focus:ring-primary" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">E-mail</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full rounded-lg border-2 border-white/10 bg-neutral-dark/50 p-3 text-white transition focus:border-primary focus:ring-primary" />
                </div>
                <div>
                  <label htmlFor="assunto" className="block text-sm font-medium text-white/70 mb-2">Assunto</label>
                  <input type="text" id="assunto" name="assunto" value={formData.assunto} onChange={handleChange} required className="w-full rounded-lg border-2 border-white/10 bg-neutral-dark/50 p-3 text-white transition focus:border-primary focus:ring-primary" />
                </div>
                <div>
                  <label htmlFor="mensagem" className="block text-sm font-medium text-white/70 mb-2">Mensagem</label>
                  <textarea id="mensagem" name="mensagem" rows={6} value={formData.mensagem} onChange={handleChange} required className="w-full rounded-lg border-2 border-white/10 bg-neutral-dark/50 p-3 text-white transition focus:border-primary focus:ring-primary"></textarea>
                </div>
                <div>
                  <button type="submit" className="w-full rounded-full bg-primary px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 disabled:opacity-70 disabled:scale-100" disabled={status === 'enviando'}>
                    {status === 'enviando' ? 'A Enviar...' : 'Enviar Mensagem'}
                  </button>
                </div>
                {status === 'sucesso' && <p className="text-center text-green-400">Mensagem enviada com sucesso! Agradecemos o contacto.</p>}
                {status === 'erro' && <p className="text-center text-red-400">Ocorreu um erro. Por favor, tente novamente.</p>}
              </form>
            </div>

            {/* Informações de Contacto */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-secondary p-8 shadow-lg h-full">
                <h2 className="text-2xl font-bold mb-6">Informações de Contacto</h2>
                <p className="text-white/70 mb-8">Estamos à disposição para ajudar a planejar a viagem dos seus sonhos.</p>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <i className="fas fa-map-marker-alt text-primary text-xl mt-1 w-6 text-center"></i>
                    <div>
                      <strong className="text-white">Endereço</strong>
                      <p className="text-white/70">Rua Comendador Torlogo Dauntre, 74 – Sala 1207, Cambuí – Campinas – SP, Brasil – CEP 13025-270</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <i className="fas fa-envelope text-primary text-xl mt-1 w-6 text-center"></i>
                    <div>
                      <strong className="text-white">E-mail </strong>
                      <a href="mailto:guru@nomade.guru" className="text-white/70 hover:text-primary transition"> guru@nomade.guru</a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <i className="fab fa-whatsapp text-primary text-xl mt-1 w-6 text-center"></i>
                    <div>
                      <strong className="text-white">WhatsApp </strong>
                      <a href="https://wa.me/5511947745710" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition"> +55 11 94774-5710</a>
                    </div>
                  </li>
                   <li className="flex items-start gap-4">
                    <i className="fas fa-clock text-primary text-xl mt-1 w-6 text-center"></i>
                    <div>
                      <strong className="text-white">Horário de Atendimento</strong>
                      <p className="text-white/70">Segunda a Sexta: 9h às 19h<br/>Sábados: 9h às 12h</p>
                    </div>
                  </li>
                </ul>
                <div className="mt-8 pt-8 border-t border-white/10">
                    <h3 className="text-lg font-bold text-white mb-4">As nossas redes</h3>
                    <div className="flex gap-4">
                      <a href="https://www.facebook.com/nomadeguru" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="h-12 w-12 flex items-center justify-center rounded-full bg-neutral-dark/50 text-white transition hover:bg-primary"><i className="fab fa-facebook-f text-xl"></i></a>
                      <a href="https://www.instagram.com/nomade.guru/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="h-12 w-12 flex items-center justify-center rounded-full bg-neutral-dark/50 text-white transition hover:bg-primary"><i className="fab fa-instagram text-xl"></i></a>
                      <a href="https://www.youtube.com/@NomadeGuru" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="h-12 w-12 flex items-center justify-center rounded-full bg-neutral-dark/50 text-white transition hover:bg-primary"><i className="fab fa-youtube text-xl"></i></a>
                      <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Spotify" className="h-12 w-12 flex items-center justify-center rounded-full bg-neutral-dark/50 text-white transition hover:bg-primary"><i className="fab fa-spotify text-xl"></i></a>
                    </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}