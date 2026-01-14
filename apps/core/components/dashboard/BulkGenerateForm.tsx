'use client';

import { useState } from 'react';
import { Button } from '@noro/ui/button';
import { Textarea } from '@noro/ui/textarea';
import { Label } from '@noro/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@noro/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@noro/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@noro/ui/use-toast';

interface OptionConfig {
    label: string;
    name: string;
    options: string[];
}

interface BulkGenerateFormProps {
    type: string;
    onGenerate: (formData: FormData) => Promise<any>;
    placeholder: string;
    optionsConfig: OptionConfig[];
}

export default function BulkGenerateForm({ type, onGenerate, placeholder, optionsConfig }: BulkGenerateFormProps) {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(e.currentTarget);

            const result = await onGenerate(formData);

            if (result.success) {
                toast({
                    title: "Sucesso!",
                    description: `${result.count} ${type} foram gerados e salvos no banco.`,
                });
                setInput('');
            } else {
                toast({
                    title: "Erro",
                    variant: 'destructive',
                    description: result.message || "Falha ao gerar conteúdo.",
                });
            }
        } catch (error) {
            toast({
                title: "Erro",
                variant: 'destructive',
                description: "Ocorreu um erro inesperado.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Sparkles className="text-purple-500" size={24} />
                        Gerador em Massa de {type.charAt(0).toUpperCase() + type.slice(1)}
                    </CardTitle>
                    <CardDescription>
                        Cole sua lista de temas ou destinos abaixo para gerar conteúdo automaticamente com IA.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleGenerate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {optionsConfig.map((opt) => (
                                <div key={opt.name} className="space-y-2">
                                    <Label htmlFor={opt.name}>{opt.label}</Label>
                                    <Select name={opt.name}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={`Selecione ${opt.label.toLowerCase()}`} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {opt.options.map((val) => (
                                                <SelectItem key={val} value={val.toLowerCase()}>
                                                    {val}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="input-list">Lista de Tópicos (um por linha)</Label>
                            <Textarea
                                id="input-list"
                                placeholder={placeholder}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="min-h-[200px] font-mono text-sm"
                            />
                            <p className="text-xs text-muted-foreground">
                                Cada linha será processada como um item individual.
                            </p>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={loading || !input.trim()} className="w-full md:w-auto">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Gerando...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Gerar Conteúdo
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
