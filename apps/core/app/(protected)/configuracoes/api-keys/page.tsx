'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Key, Plus, Trash2, Copy, AlertTriangle, Eye, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { listApiKeys, createApiKey, revokeApiKey } from './actions';

export default function ApiKeysSettingsPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyName, setKeyName] = useState('');
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Exibição da chave gerada
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadKeys();
  }, []);

  async function loadKeys() {
    setLoading(true);
    try {
      const data = await listApiKeys();
      setKeys(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!keyName.trim()) return;

    setCreating(true);
    setErrorMsg(null);
    try {
      const res = await createApiKey(keyName);
      if (res.ok === true) {
        setGeneratedKey(res.plaintext);
        setKeyName('');
        await loadKeys();
      } else {
        setErrorMsg((res as any).error || 'Erro ao criar chave.');
      }
    } catch (err) {
      setErrorMsg('Erro de conexão ao criar chave.');
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke(id: string) {
    if (!confirm('Tem certeza que deseja revogar esta chave de API? Sistemas integrados usando esta chave perderão o acesso imediatamente.')) {
      return;
    }

    try {
      await revokeApiKey(id);
      await loadKeys();
    } catch (err) {
      alert('Erro ao revogar chave.');
    }
  }

  function handleCopy() {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <main className="flex-1 space-y-6 max-w-5xl mx-auto p-4 md:p-6">
      {/* Header */}
      <header className="border-b border-gray-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/configuracoes">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Configurações
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Key className="h-6 w-6 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900 font-sans">
              Chaves de API
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Crie e gerencie chaves de acesso externas para integração de sistemas com a Noro Guru.
          </p>
        </div>
      </header>

      {/* Alerta de chave criada com sucesso */}
      {generatedKey && (
        <div className="bg-emerald-50 border border-emerald-500 rounded-xl p-6 shadow-sm animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3 mb-3 text-emerald-800">
            <Shield className="h-6 w-6" />
            <h3 className="font-bold text-lg">Chave de API gerada com sucesso!</h3>
          </div>
          <p className="text-sm text-emerald-700 mb-4">
            Copie a chave agora. Por motivos de segurança, você não poderá visualizá-la novamente depois de fechar este aviso.
          </p>
          <div className="flex items-center justify-between gap-4 bg-gray-950 p-4 rounded-lg border border-gray-800">
            <code className="text-emerald-400 font-mono text-sm break-all select-all">
              {generatedKey}
            </code>
            <Button onClick={handleCopy} size="sm" className={copied ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-800 hover:bg-gray-700'}>
              {copied ? 'Copiado!' : <><Copy className="mr-2 h-4 w-4" /> Copiar</>}
            </Button>
          </div>
          <Button onClick={() => setGeneratedKey(null)} variant="outline" className="mt-4 border-emerald-500 text-emerald-800 hover:bg-emerald-100">
            Entendi, salvei a chave
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Criar Chave */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Nova Chave de API</CardTitle>
            <CardDescription>Gere credenciais para integradores.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              {errorMsg && (
                <div className="text-xs bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg">
                  {errorMsg}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="keyName">Nome da Chave</Label>
                <Input
                  id="keyName"
                  required
                  placeholder="Ex: Integração Site Principal"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Escopo / Permissões</Label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <Badge className="bg-indigo-50 border-indigo-200 text-indigo-700 rounded border">
                    visa:read
                  </Badge>
                  <span className="text-xs text-gray-500">Leitura de vistos (padrão)</span>
                </div>
              </div>
              <Button type="submit" disabled={creating || !keyName.trim()} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                {creating ? 'Gerando...' : <><Plus className="mr-2 h-4 w-4" /> Gerar Chave</>}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Listagem de Chaves */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Chaves Cadastradas</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {keys.length} {keys.length === 1 ? 'chave' : 'chaves'}
              </span>
            </CardTitle>
            <CardDescription>Lista de credenciais de integração ativas.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 text-center text-gray-500 text-sm">
                Carregando credenciais...
              </div>
            ) : keys.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
                <div className="text-3xl mb-2">🔑</div>
                <p className="text-sm font-semibold text-gray-700">Nenhuma chave de API ativa</p>
                <p className="text-xs text-gray-500 mt-1">Crie sua primeira chave no painel ao lado.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Últimos 4</TableHead>
                    <TableHead>Escopos</TableHead>
                    <TableHead>Criada em</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-semibold text-gray-900">
                        {key.name}
                      </TableCell>
                      <TableCell className="font-mono text-gray-500">
                        ...{key.last4}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {(Array.isArray(key.scope) ? key.scope : [key.scope]).map((s: string) => (
                            <Badge key={s} className="text-xs bg-gray-100 text-gray-700 border-none rounded">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-gray-500">
                        {key.created_at ? new Date(key.created_at).toLocaleDateString('pt-BR') : '—'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRevoke(key.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

      </div>
    </main>
  );
}
