'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@noro/ui';
import { Button } from '@noro/ui';
import { Input } from '@noro/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@noro/ui';
import { useRouter } from 'next/navigation';
import { useToast } from '@noro/ui';

interface CategoriaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoria?: any;
  tenantId: string;
}

const ICONES_COMUNS = [
  '💰', '💵', '💳', '🏦', '📊', '📈', '📉', '💼', '🏢',
  '🏠', '🚗', '✈️', '🍔', '☕', '🎬', '🎮', '📱', '💻',
  '🔧', '⚡', '💡', '📦', '🎓', '🏥', '🛒', '👕', '🎁'
];

const CORES_COMUNS = [
  '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444',
  '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#6366f1'
];

export function CategoriaFormModal({
  isOpen,
  onClose,
  categoria,
  tenantId,
}: CategoriaFormModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: categoria?.nome || '',
    tipo: categoria?.tipo || 'despesa',
    icone: categoria?.icone || '📂',
    cor: categoria?.cor || '#3b82f6',
    descricao: categoria?.descricao || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const url = categoria
        ? `/api/categorias/${categoria.id}`
        : '/api/categorias';

      const method = categoria ? 'PUT' : 'POST';

      const dadosParaEnviar = {
        ...formData,
        tenant_id: tenantId,
      };

      console.log('📤 Enviando dados:', {
        url,
        method,
        data: dadosParaEnviar
      });

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosParaEnviar),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Sucesso:', data);
        toast({
          title: 'Sucesso',
          description: `Categoria ${categoria ? 'atualizada' : 'criada'} com sucesso!`,
          variant: 'success',
        });
        router.refresh();
        onClose();
      } else {
        console.error('❌ Erro na resposta:', data);
        setError(data.error || 'Erro desconhecido ao salvar categoria');
        toast({
          title: 'Erro ao salvar',
          description: data.error || 'Erro desconhecido',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('❌ Erro ao salvar categoria:', error);
      setError('Erro ao conectar com o servidor');
      toast({
        title: 'Erro ao salvar categoria',
        description: 'Verifique o console para mais detalhes',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {categoria ? 'Editar Categoria' : 'Nova Categoria'}
          </DialogTitle>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-800">
              ⚠️ {error}
            </div>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome e Tipo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome*</label>
              <Input
                required
                value={formData.nome}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                placeholder="Ex: Marketing Digital"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tipo*</label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => setFormData({ ...formData, tipo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Ícone */}
          <div>
            <label className="block text-sm font-medium mb-1">Ícone*</label>
            <div className="grid grid-cols-9 gap-2 mb-2">
              {ICONES_COMUNS.map((icone) => (
                <button
                  key={icone}
                  type="button"
                  onClick={() => setFormData({ ...formData, icone })}
                  className={`p-2 text-2xl border rounded hover:bg-muted ${formData.icone === icone ? 'bg-primary/10 border-primary' : ''
                    }`}
                >
                  {icone}
                </button>
              ))}
            </div>
            <Input
              value={formData.icone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, icone: e.target.value })
              }
              placeholder="Ou digite um emoji"
              maxLength={2}
            />
          </div>

          {/* Cor */}
          <div>
            <label className="block text-sm font-medium mb-1">Cor*</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {CORES_COMUNS.map((cor) => (
                <button
                  key={cor}
                  type="button"
                  onClick={() => setFormData({ ...formData, cor })}
                  className={`w-10 h-10 rounded border-2 ${formData.cor === cor ? 'border-primary scale-110' : 'border-gray-300'
                    }`}
                  style={{ backgroundColor: cor }}
                />
              ))}
            </div>
            <Input
              type="color"
              value={formData.cor}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, cor: e.target.value })
              }
              className="h-12"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <Input
              value={formData.descricao}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, descricao: e.target.value })
              }
              placeholder="Descrição opcional da categoria"
            />
          </div>

          {/* Preview */}
          <div className="border rounded p-4 bg-muted/50">
            <div className="text-sm text-muted-foreground mb-2">Preview:</div>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded flex items-center justify-center text-2xl"
                style={{ backgroundColor: formData.cor }}
              >
                {formData.icone}
              </div>
              <div>
                <div className="font-semibold">{formData.nome || 'Nome da Categoria'}</div>
                <div className="text-sm text-muted-foreground">
                  {formData.tipo === 'receita' ? '📈 Receita' : '📉 Despesa'}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : categoria ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
