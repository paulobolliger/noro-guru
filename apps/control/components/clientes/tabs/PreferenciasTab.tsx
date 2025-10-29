'use client';

import { useState, useEffect } from 'react';
import { Heart, Save, X } from 'lucide-react';
import { getClientePreferencias, upsertPreferencias } from "@/app/(protected)/clientes/[id]/actions";
import { useRouter } from 'next/navigation';

interface PreferenciasTabProps {
  clienteId: string;
}

export default function PreferenciasTab({ clienteId }: PreferenciasTabProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    frequencia_viagem: '',
    orcamento_medio: '',
    estilo_viagem: [] as string[],
    destinos_favoritos: '',
    destinos_desejados: '',
    assento_preferido: '',
    classe_preferida: '',
    tipo_hospedagem: [] as string[],
    categoria_hotel: '',
    preferencias_quarto: '',
    restricoes_alimentares: [] as string[],
    refeicao_preferida: '',
    necessidades_especiais: '',
    mobilidade_reduzida: false,
    viaja_com_criancas: false,
    viaja_com_pets: false,
    seguro_preferido: '',
    aluguel_carro: false,
    tours_guiados: false,
    transfers: false,
    observacoes: '',
  });

  useEffect(() => {
    loadPreferencias();
  }, [clienteId]);

  async function loadPreferencias() {
    setIsLoading(true);
    const result = await getClientePreferencias(clienteId);
    if (result.success && result.data) {
      setFormData({
        frequencia_viagem: result.data.frequencia_viagem || '',
        orcamento_medio: result.data.orcamento_medio || '',
        estilo_viagem: result.data.estilo_viagem || [],
        destinos_favoritos: result.data.destinos_favoritos?.join(', ') || '',
        destinos_desejados: result.data.destinos_desejados?.join(', ') || '',
        assento_preferido: result.data.assento_preferido || '',
        classe_preferida: result.data.classe_preferida || '',
        tipo_hospedagem: result.data.tipo_hospedagem || [],
        categoria_hotel: result.data.categoria_hotel || '',
        preferencias_quarto: result.data.preferencias_quarto || '',
        restricoes_alimentares: result.data.restricoes_alimentares || [],
        refeicao_preferida: result.data.refeicao_preferida || '',
        necessidades_especiais: result.data.necessidades_especiais || '',
        mobilidade_reduzida: result.data.mobilidade_reduzida || false,
        viaja_com_criancas: result.data.viaja_com_criancas || false,
        viaja_com_pets: result.data.viaja_com_pets || false,
        seguro_preferido: result.data.seguro_preferido || '',
        aluguel_carro: result.data.aluguel_carro || false,
        tours_guiados: result.data.tours_guiados || false,
        transfers: result.data.transfers || false,
        observacoes: result.data.observacoes || '',
      });
    }
    setIsLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }

  function handleMultiSelect(name: string, value: string) {
    setFormData(prev => {
      const current = prev[name as keyof typeof prev] as string[];
      const newValue = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [name]: newValue };
    });
  }

  async function handleSave() {
    setIsSaving(true);

    const formDataToSend = new FormData();
    
    formDataToSend.append('frequencia_viagem', formData.frequencia_viagem);
    formDataToSend.append('orcamento_medio', formData.orcamento_medio);
    formDataToSend.append('estilo_viagem', formData.estilo_viagem.join(','));
    formDataToSend.append('destinos_favoritos', formData.destinos_favoritos);
    formDataToSend.append('destinos_desejados', formData.destinos_desejados);
    formDataToSend.append('assento_preferido', formData.assento_preferido);
    formDataToSend.append('classe_preferida', formData.classe_preferida);
    formDataToSend.append('tipo_hospedagem', formData.tipo_hospedagem.join(','));
    formDataToSend.append('categoria_hotel', formData.categoria_hotel);
    formDataToSend.append('preferencias_quarto', formData.preferencias_quarto);
    formDataToSend.append('restricoes_alimentares', formData.restricoes_alimentares.join(','));
    formDataToSend.append('refeicao_preferida', formData.refeicao_preferida);
    formDataToSend.append('necessidades_especiais', formData.necessidades_especiais);
    formDataToSend.append('mobilidade_reduzida', String(formData.mobilidade_reduzida));
    formDataToSend.append('viaja_com_criancas', String(formData.viaja_com_criancas));
    formDataToSend.append('viaja_com_pets', String(formData.viaja_com_pets));
    formDataToSend.append('seguro_preferido', formData.seguro_preferido);
    formDataToSend.append('aluguel_carro', String(formData.aluguel_carro));
    formDataToSend.append('tours_guiados', String(formData.tours_guiados));
    formDataToSend.append('transfers', String(formData.transfers));
    formDataToSend.append('observacoes', formData.observacoes);

    const result = await upsertPreferencias(clienteId, formDataToSend);

    if (result.success) {
      setIsEditing(false);
      router.refresh();
    } else {
      alert('Erro ao salvar: ' + result.error);
    }

    setIsSaving(false);
  }

  if (isLoading) {
    return (
      <div className="surface-card rounded-xl shadow-sm border border-default p-6">
        <div className="text-center py-12 text-muted">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="surface-card rounded-xl shadow-sm border border-default">
      <div className="flex items-center justify-between p-6 border-b border-default border-default">
        <div className="flex items-center gap-3">
          <Heart className="w-6 h-6 text-pink-600" />
          <div>
            <h2 className="text-xl font-semibold text-primary">Preferências de Viagem</h2>
            <p className="text-sm text-muted">Personalize a experiência do cliente</p>
          </div>
        </div>
        
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            Editar
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsEditing(false);
                loadPreferencias();
              }}
              className="px-4 py-2 text-muted hover:bg-white/5 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="space-y-8">
          
          {/* VIAGEM */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Viagem</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Frequência
                </label>
                {isEditing ? (
                  <select
                    name="frequencia_viagem"
                    value={formData.frequencia_viagem}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">Selecione...</option>
                    <option value="mensal">Mensal</option>
                    <option value="trimestral">Trimestral</option>
                    <option value="semestral">Semestral</option>
                    <option value="anual">Anual</option>
                    <option value="eventual">Eventual</option>
                  </select>
                ) : (
                  <p className="text-primary">{formData.frequencia_viagem || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Orçamento Médio
                </label>
                {isEditing ? (
                  <select
                    name="orcamento_medio"
                    value={formData.orcamento_medio}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">Selecione...</option>
                    <option value="economico">Econômico</option>
                    <option value="moderado">Moderado</option>
                    <option value="confortavel">Confortável</option>
                    <option value="luxo">Luxo</option>
                    <option value="ultra_luxo">Ultra Luxo</option>
                  </select>
                ) : (
                  <p className="text-primary">{formData.orcamento_medio || '-'}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-primary mb-2">
                  Estilo de Viagem
                </label>
                {isEditing ? (
                  <div className="flex flex-wrap gap-2">
                    {['aventura', 'relaxante', 'cultural', 'gastronomico', 'romantico', 'familia'].map(estilo => (
                      <button
                        key={estilo}
                        type="button"
                        onClick={() => handleMultiSelect('estilo_viagem', estilo)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          formData.estilo_viagem.includes(estilo)
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/10 text-primary hover:bg-white/15'
                        }`}
                      >
                        {estilo}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-primary">{formData.estilo_viagem.join(', ') || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Destinos Favoritos
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="destinos_favoritos"
                    value={formData.destinos_favoritos}
                    onChange={handleChange}
                    placeholder="Ex: Paris, Roma, Lisboa"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                ) : (
                  <p className="text-primary">{formData.destinos_favoritos || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Destinos Desejados
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="destinos_desejados"
                    value={formData.destinos_desejados}
                    onChange={handleChange}
                    placeholder="Ex: Maldivas, Dubai"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                ) : (
                  <p className="text-primary">{formData.destinos_desejados || '-'}</p>
                )}
              </div>
            </div>
          </div>

          {/* VÔO */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Preferências de Vôo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Assento Preferido
                </label>
                {isEditing ? (
                  <select
                    name="assento_preferido"
                    value={formData.assento_preferido}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">Selecione...</option>
                    <option value="janela">Janela</option>
                    <option value="corredor">Corredor</option>
                    <option value="qualquer">Qualquer</option>
                  </select>
                ) : (
                  <p className="text-primary">{formData.assento_preferido || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Classe Preferida
                </label>
                {isEditing ? (
                  <select
                    name="classe_preferida"
                    value={formData.classe_preferida}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">Selecione...</option>
                    <option value="economica">Econômica</option>
                    <option value="economica_premium">Econômica Premium</option>
                    <option value="executiva">Executiva</option>
                    <option value="primeira_classe">Primeira Classe</option>
                  </select>
                ) : (
                  <p className="text-primary">{formData.classe_preferida || '-'}</p>
                )}
              </div>
            </div>
          </div>

          {/* HOSPEDAGEM */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Hospedagem</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Tipo de Hospedagem
                </label>
                {isEditing ? (
                  <div className="flex flex-wrap gap-2">
                    {['hotel', 'resort', 'pousada', 'apartamento'].map(tipo => (
                      <button
                        key={tipo}
                        type="button"
                        onClick={() => handleMultiSelect('tipo_hospedagem', tipo)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          formData.tipo_hospedagem.includes(tipo)
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/10 text-primary hover:bg-white/15'
                        }`}
                      >
                        {tipo}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-primary">{formData.tipo_hospedagem.join(', ') || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Categoria
                </label>
                {isEditing ? (
                  <select
                    name="categoria_hotel"
                    value={formData.categoria_hotel}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">Selecione...</option>
                    <option value="3_estrelas">3 Estrelas</option>
                    <option value="4_estrelas">4 Estrelas</option>
                    <option value="5_estrelas">5 Estrelas</option>
                    <option value="boutique">Boutique</option>
                    <option value="luxo">Luxo</option>
                  </select>
                ) : (
                  <p className="text-primary">{formData.categoria_hotel || '-'}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-primary mb-2">
                  Preferências de Quarto
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="preferencias_quarto"
                    value={formData.preferencias_quarto}
                    onChange={handleChange}
                    placeholder="Ex: Vista mar, andar alto, cama king"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                ) : (
                  <p className="text-primary">{formData.preferencias_quarto || '-'}</p>
                )}
              </div>
            </div>
          </div>

          {/* ALIMENTAÇÃO */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Alimentação</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Restrições
                </label>
                {isEditing ? (
                  <div className="flex flex-wrap gap-2">
                    {['vegetariano', 'vegano', 'sem_gluten', 'sem_lactose'].map(restricao => (
                      <button
                        key={restricao}
                        type="button"
                        onClick={() => handleMultiSelect('restricoes_alimentares', restricao)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          formData.restricoes_alimentares.includes(restricao)
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/10 text-primary hover:bg-white/15'
                        }`}
                      >
                        {restricao.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-primary">{formData.restricoes_alimentares.join(', ') || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Refeição Preferida
                </label>
                {isEditing ? (
                  <select
                    name="refeicao_preferida"
                    value={formData.refeicao_preferida}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">Selecione...</option>
                    <option value="cafe_manha">Café da Manhã</option>
                    <option value="meia_pensao">Meia Pensão</option>
                    <option value="pensao_completa">Pensão Completa</option>
                    <option value="all_inclusive">All Inclusive</option>
                  </select>
                ) : (
                  <p className="text-primary">{formData.refeicao_preferida || '-'}</p>
                )}
              </div>
            </div>
          </div>

          {/* NECESSIDADES ESPECIAIS */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Necessidades Especiais</h3>
            <div className="space-y-3">
              
              {isEditing ? (
                <>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="mobilidade_reduzida"
                      checked={formData.mobilidade_reduzida}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-primary">Mobilidade Reduzida</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="viaja_com_criancas"
                      checked={formData.viaja_com_criancas}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-primary">Viaja com Crianças</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="viaja_com_pets"
                      checked={formData.viaja_com_pets}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-primary">Viaja com Pets</span>
                  </label>
                </>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-primary">
                    <span className="font-medium">Mobilidade Reduzida:</span> {formData.mobilidade_reduzida ? 'Sim' : 'Não'}
                  </p>
                  <p className="text-sm text-primary">
                    <span className="font-medium">Viaja com Crianças:</span> {formData.viaja_com_criancas ? 'Sim' : 'Não'}
                  </p>
                  <p className="text-sm text-primary">
                    <span className="font-medium">Viaja com Pets:</span> {formData.viaja_com_pets ? 'Sim' : 'Não'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* EXTRAS */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Serviços Extras</h3>
            <div className="space-y-3">
              
              {isEditing ? (
                <>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="aluguel_carro"
                      checked={formData.aluguel_carro}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-primary">Aluguel de Carro</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="tours_guiados"
                      checked={formData.tours_guiados}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-primary">Tours Guiados</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="transfers"
                      checked={formData.transfers}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-primary">Transfers</span>
                  </label>
                </>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-primary">
                    <span className="font-medium">Aluguel de Carro:</span> {formData.aluguel_carro ? 'Sim' : 'Não'}
                  </p>
                  <p className="text-sm text-primary">
                    <span className="font-medium">Tours Guiados:</span> {formData.tours_guiados ? 'Sim' : 'Não'}
                  </p>
                  <p className="text-sm text-primary">
                    <span className="font-medium">Transfers:</span> {formData.transfers ? 'Sim' : 'Não'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* OBSERVAÇÕES */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Observações Gerais
            </label>
            {isEditing ? (
              <textarea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Observações adicionais sobre preferências..."
              />
            ) : (
              <p className="text-primary whitespace-pre-wrap">{formData.observacoes || '-'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}