// Fix: Refactored to use ModalProvider for consistent modal state management, resolving prop type errors on Header and Footer components.
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Values from './components/Values';
import Ecosystem from './components/Ecosystem';
import Footer from './components/Footer';
import { ModalProvider } from './components/providers/modal-provider';

const App: React.FC = () => {
  return (
    <ModalProvider>
      <div className="bg-noro-dark font-sans text-noro-gray-light min-h-screen overflow-x-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] bg-noro-purple/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-[50vw] h-[50vw] bg-noro-turquoise/10 rounded-full filter blur-3xl animate-pulse-slow animation-delay-2000"></div>
        </div>
        <div className="relative z-10">
          <Header />
          <main>
            <Hero />
            <Features />
            <Values />
            <Ecosystem />
          </main>
          <Footer />
        </div>
      </div>
    </ModalProvider>
  );
};

export default App;
