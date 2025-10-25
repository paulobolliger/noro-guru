import { FormEvent, useState } from 'react'
import Container from '@/components/Container'

export default function ContactForm() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form) as any)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.message || 'Falha ao enviar')
      setSent(true)
      form.reset()
    } catch (err: any) {
      setError(err.message || 'Falha ao enviar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contato" className="section">
      <Container>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <span className="badge">Contato</span>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold text-noro">Fale com a NORO</h2>
            <p className="mt-3 text-gray-600 max-w-md">
              O que você chama de caos, a NORO chama de dados organizados.
            </p>
            <p className="mt-2 text-gray-600 max-w-md">
              Envie sua ideia. Em instantes, respondemos com o próximo passo.
            </p>
          </div>
          <div>
            {sent ? (
              <div className="card p-6 text-center" aria-live="polite">
                <div className="text-2xl">✅</div>
                <h3 className="mt-2 font-semibold text-lg text-noro">Recebemos sua mensagem!</h3>
                <p className="mt-1 text-gray-700">A equipe NORO entrará em contato.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="card p-6 space-y-4">
                {/* Honeypot */}
                <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" />
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome</label>
                  <input required name="nome" className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-guru" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">E-mail</label>
                  <input required type="email" name="email" className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-guru" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tipo de site desejado</label>
                  <select name="tipo" className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-guru">
                    <option>Start</option>
                    <option>Pro</option>
                    <option>Elite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mensagem</label>
                  <textarea name="mensagem" rows={4} className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-guru" />
                </div>
                {error && (
                  <div className="text-sm text-red-600">{error}</div>
                )}
                <button disabled={loading} className="btn btn-primary w-full" type="submit">
                  {loading ? 'Enviando…' : 'Solicitar Orçamento'}
                </button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
