'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2, User, Bot } from 'lucide-react';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'agent';
  timestamp: Date;
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! 👋 Como posso ajudar você hoje?',
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opening
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Obrigado pela sua mensagem! Um atendente irá responder em breve. Enquanto isso, você pode consultar nosso FAQ acima. 😊',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (isMinimized) setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={toggleWidget}
          className="fixed bottom-6 right-6 bg-[#6C5CE7] hover:bg-[#5F4FD1] text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-all z-50 group animate-bounce-subtle"
          aria-label="Abrir chat de suporte"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            1
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 bg-[#1A1A24] border-2 border-[#6C5CE7] rounded-2xl shadow-2xl z-50 transition-all ${
            isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
          } flex flex-col overflow-hidden animate-slide-in-right`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#6C5CE7] to-[#5F4FD1] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-[#6C5CE7]" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h3 className="text-white font-semibold">Suporte Noro.guru</h3>
                <p className="text-white/80 text-xs">Online • Resposta rápida</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMinimize}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Minimizar chat"
              >
                {isMinimized ? <Maximize2 className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
              </button>
              <button
                onClick={toggleWidget}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Fechar chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0B1220]">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.sender === 'user' ? 'bg-[#6C5CE7]' : 'bg-[#2E2E3A]'
                    }`}>
                      {msg.sender === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-[#6C5CE7]" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      msg.sender === 'user'
                        ? 'bg-[#6C5CE7] text-white'
                        : 'bg-[#2E2E3A] text-[#E0E3FF]'
                    }`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'user' ? 'text-white/70' : 'text-[#B8C1E0]'
                      }`}>
                        {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="p-4 bg-[#1A1A24] border-t border-[#2E2E3A]">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 bg-[#2E2E3A] border border-[#2E2E3A] rounded-xl px-4 py-2 text-[#E0E3FF] placeholder:text-[#B8C1E0] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="bg-[#6C5CE7] hover:bg-[#5F4FD1] disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2 transition-all hover:scale-105"
                    aria-label="Enviar mensagem"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-[#B8C1E0] text-xs mt-2 text-center">
                  Pressione Enter para enviar
                </p>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
