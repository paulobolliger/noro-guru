'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  MessageSquare, Send, Phone, Search, MoreVertical,
  Paperclip, Smile, Settings, User, Check, CheckCheck,
  MessageCircle, Globe, AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils'; // Assumindo que você tem utils padrão no shadcn/ui

// Tipos simulados para UI
type ChannelType = 'whatsapp' | 'telegram' | 'site';

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  platform: ChannelType;
  status: 'online' | 'offline';
  lastMessage: string;
  unread: number;
  time: string;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export default function CommunicationPage() {
  const [selectedContactId, setSelectedContactId] = useState<string>('1');
  const [activeTab, setActiveTab] = useState('inbox');
  const [inputText, setInputText] = useState('');

  // Dados Mockados
  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Maria Silva',
      platform: 'whatsapp',
      status: 'online',
      lastMessage: 'Gostaria de saber mais sobre o visto...',
      unread: 2,
      time: '10:42'
    },
    {
      id: '2',
      name: 'João Pedro',
      platform: 'telegram',
      status: 'offline',
      lastMessage: 'Ok, aguardo o retorno.',
      unread: 0,
      time: 'Ontem'
    },
    {
      id: '3',
      name: 'Visitante #882',
      platform: 'site',
      status: 'online',
      lastMessage: 'Tem alguém disponível?',
      unread: 0,
      time: '09:15'
    }
  ];

  const currentMessages: Message[] = [
    { id: '1', content: 'Olá, bom dia! Tudo bem?', sender: 'agent', timestamp: '10:30', status: 'read' },
    { id: '2', content: 'Bom dia! Gostaria de saber mais sobre o visto D7 para Portugal.', sender: 'user', timestamp: '10:32', status: 'read' },
    { id: '3', content: 'Claro! É uma ótima escolha para renda passiva.', sender: 'agent', timestamp: '10:33', status: 'read' },
    { id: '4', content: 'Quais são os documentos necessários?', sender: 'user', timestamp: '10:42', status: 'read' },
  ];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    // Lógica de envio mockada
    setInputText('');
  };

  const getChannelIcon = (type: ChannelType) => {
    switch (type) {
      case 'whatsapp': return <Phone size={16} className="text-green-500" />; // Usando Phone no lugar de WhatsApp icon se não tiver lucide especifico
      case 'telegram': return <Send size={16} className="text-blue-500 rotate-[-45deg]" />; // Simulando aviãozinho
      case 'site': return <Globe size={16} className="text-purple-500" />;
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span><strong>Em Desenvolvimento</strong> — Este módulo está em construção. Os dados exibidos são simulados e o envio de mensagens não funciona ainda.</span>
      </div>
    <div className="h-[calc(100vh-theme(spacing.20))] flex flex-col md:flex-row gap-0 md:gap-4 bg-slate-50">
      {/* LEFT SIDEBAR - LISTA DE CONVERSAS */}
      <div className="w-full md:w-80 flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-[600px] md:h-full">
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Inbox</h2>
            <Button variant="ghost" size="icon"><Settings size={20} className="text-slate-400" /></Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input placeholder="Buscar conversas..." className="pl-9 bg-slate-50 border-slate-200" />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-1 p-2 bg-slate-50 border-b border-slate-200 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('inbox')}
            className={`px-2.5 py-1 rounded-full text-xs border ${activeTab === 'inbox' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300'}`}
          >
            Tudo
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('whatsapp')}
            className={`px-2.5 py-1 rounded-full text-xs border ${activeTab === 'whatsapp' ? 'bg-green-600 text-white border-green-600' : 'bg-green-100 text-green-700 border-transparent'}`}
          >
            WhatsApp
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('telegram')}
            className={`px-2.5 py-1 rounded-full text-xs border ${activeTab === 'telegram' ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-100 text-blue-700 border-transparent'}`}
          >
            Telegram
          </button>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {contacts.map(contact => (
            <div
              key={contact.id}
              onClick={() => setSelectedContactId(contact.id)}
              className={cn(
                "flex items-start gap-3 p-4 cursor-pointer transition-colors border-b border-slate-50 hover:bg-slate-50",
                selectedContactId === contact.id ? "bg-blue-50/50 border-l-4 border-l-blue-500" : "border-l-4 border-l-transparent"
              )}
            >
              <div className="relative">
                <Avatar>
                  <AvatarFallback className="bg-slate-200 text-slate-600 font-bold">
                    {contact.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {contact.platform === 'whatsapp' && <span className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-white"><Check size={8} className="text-white" /></span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h3 className="font-semibold text-sm text-slate-900 truncate">{contact.name}</h3>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">{contact.time}</span>
                </div>
                <p className="text-xs text-slate-500 truncate">{contact.lastMessage}</p>
              </div>
              {contact.unread > 0 && (
                <span className="bg-blue-600 text-white h-5 w-5 text-[10px] flex items-center justify-center rounded-full p-0">
                  {contact.unread}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-[600px] md:h-full">
        {/* Chat Header */}
        <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-white">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-100 text-blue-600">MS</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                Maria Silva
                <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase flex items-center gap-1">
                  <MessageCircle size={10} /> WhatsApp
                </span>
              </h3>
              <p className="text-xs text-slate-500">Online agora</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-slate-400"><Search size={20} /></Button>
            <Button variant="ghost" size="icon" className="text-slate-400"><MoreVertical size={20} /></Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {currentMessages.map(msg => (
            <div key={msg.id} className={cn("flex w-full", msg.sender === 'agent' ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[70%] p-3 rounded-2xl text-sm shadow-sm",
                msg.sender === 'agent'
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white text-slate-700 border border-slate-200 rounded-bl-none"
              )}>
                <p>{msg.content}</p>
                <div className={cn("flex justify-end items-center gap-1 mt-1 text-[10px]", msg.sender === 'agent' ? "text-blue-200" : "text-slate-400")}>
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'agent' && <CheckCheck size={12} />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-2">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 h-8 w-8 rounded-full">
              <Smile size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 h-8 w-8 rounded-full">
              <Paperclip size={20} />
            </Button>
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-700 placeholder:text-slate-400"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-8 w-8 ml-2"
            >
              <Send size={16} />
            </Button>
          </div>
          <div className="text-center mt-2">
            <p className="text-[10px] text-slate-400">Pressione Enter para enviar</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR - INFO CONTACT (Hidden on small screens) */}
      <div className="hidden lg:block w-72 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <div className="flex flex-col items-center mb-6">
          <Avatar className="h-20 w-20 mb-3">
            <AvatarFallback className="bg-slate-100 text-slate-400 text-2xl">MS</AvatarFallback>
          </Avatar>
          <h3 className="font-bold text-lg text-slate-800">Maria Silva</h3>
          <p className="text-slate-500 text-sm mb-4">+55 11 99999-9999</p>

          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1 text-xs h-8">Perfil CRM</Button>
            <Button variant="outline" className="flex-1 text-xs h-8 text-red-500 hover:text-red-600">Bloquear</Button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Etiquetas</span>
            <div className="flex gap-2 flex-wrap mt-2">
              <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700 pointer-events-none">Lead Quente</span>
              <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-700 pointer-events-none">Visto D7</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Anotações</span>
            <div className="mt-2 text-sm text-slate-600 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
              Cliente interessada em mudar para Portugal em 2026. Precisa de assessoria completa.
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
