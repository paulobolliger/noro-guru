'use client';

import React from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Em uma aplicação real, você lidaria com o envio do formulário aqui.
    alert('Obrigado pela sua mensagem!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-noro-dark/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-noro-dark-2 border border-noro-gray-future rounded-xl p-8 max-w-lg w-full m-4 relative animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-noro-accent/60 hover:text-white transition-colors"
          aria-label="Fechar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="font-display text-3xl font-bold text-white mb-6">Fale Conosco</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-noro-accent/80 mb-2">Nome</label>
            <input
              type="text"
              id="name"
              required
              className="w-full bg-noro-dark border border-noro-gray-future rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-noro-turquoise"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-noro-accent/80 mb-2">Email</label>
            <input
              type="email"
              id="email"
              required
              className="w-full bg-noro-dark border border-noro-gray-future rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-noro-turquoise"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-noro-accent/80 mb-2">Mensagem</label>
            <textarea
              id="message"
              rows={4}
              required
              className="w-full bg-noro-dark border border-noro-gray-future rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-noro-turquoise"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-noro-turquoise to-noro-purple text-white font-bold py-3 px-8 rounded-lg text-lg hover:scale-105 transition-transform"
          >
            Enviar Mensagem
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
