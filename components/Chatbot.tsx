import { useEffect, useRef, useState } from 'react'

type Msg = { role: 'user' | 'assistant'; content: string }

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'assistant', content: 'Olá! Sou o núcleo NORO. Como posso ajudar?' },
  ])
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, open])

  const send = async () => {
    if (!input.trim()) return
    const m = input
    setMsgs((s) => [...s, { role: 'user', content: m }])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: m, history: msgs }),
      })
      const json = await res.json()
      setMsgs((s) => [...s, { role: 'assistant', content: json.reply || '...' }])
    } catch (e) {
      setMsgs((s) => [...s, { role: 'assistant', content: 'Tive um problema ao responder agora. Tente novamente.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 btn bg-guru text-white shadow-soft hover:bg-noro"
        aria-label={open ? 'Fechar chat' : 'Abrir chat'}
      >
        {open ? 'Fechar' : 'Chat NORO'}
      </button>
      {open && (
        <div className="fixed bottom-20 right-5 z-50 w-80 md:w-96 card p-0 overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-guru to-noro text-white font-medium">NORO Assistant</div>
          <div className="p-3 h-72 overflow-y-auto space-y-2 bg-white">
            {msgs.map((m, i) => (
              <div key={i} className={`text-sm ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block px-3 py-2 rounded-lg ${m.role === 'user' ? 'bg-light text-gray-900' : 'bg-core/20 text-gray-900'}`}>{m.content}</div>
              </div>
            ))}
            {loading && <div className="text-xs text-gray-500">digitando…</div>}
            <div ref={endRef} />
          </div>
          <div className="p-2 flex gap-2">
            <input
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-guru"
              placeholder="Digite sua pergunta"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
            />
            <button onClick={send} className="btn btn-primary">Enviar</button>
          </div>
        </div>
      )}
    </>
  )
}

