'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Instagram, Mail, LayoutTemplate, Share2, Megaphone, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function MarketingPage() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Marketing</h1>
        <p className="text-gray-500 mt-2">
          Gerencie suas campanhas de marketing, redes sociais e comunicação em um só lugar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Social Media Card */}
        <Link href="/marketing/social">
          <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-purple-500 h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Redes Sociais</CardTitle>
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                  <Share2 size={24} />
                </div>
              </div>
              <CardDescription>
                Agende e gerencie posts para Instagram, Facebook e LinkedIn com IA.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 mt-2">
                <li className="flex items-center gap-2">
                  <LayoutTemplate size={16} /> Agendamento de Posts
                </li>
                <li className="flex items-center gap-2">
                  <Megaphone size={16} /> Geração de Copy com IA
                </li>
              </ul>
            </CardContent>
          </Card>
        </Link>

        {/* Email Marketing Card */}
        <Link href="/marketing/email">
          <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-blue-500 h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Email Marketing</CardTitle>
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <Mail size={24} />
                </div>
              </div>
              <CardDescription>
                Crie e envie campanhas de email newsletter para seus clientes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 mt-2">
                <li className="flex items-center gap-2">
                  <LayoutTemplate size={16} /> Templates Prontos
                </li>
                <li className="flex items-center gap-2">
                  <BarChart3 size={16} /> Análise de Abertura
                </li>
              </ul>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
