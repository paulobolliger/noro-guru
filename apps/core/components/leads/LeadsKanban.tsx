'use client'

import { useState } from 'react'
import { Users, Mail, Phone, DollarSign, Calendar, Tag } from 'lucide-react'

interface Lead {
  id: string
  nome: string
  email: string
  telefone?: string
  empresa?: string
  status: 'novo' | 'contato' | 'qualificado' | 'proposta' | 'convertido' | 'perdido'
  origem: string
  valor_estimado?: number
  created_at: string
}

interface KanbanProps {
  leads: Lead[]
  onLeadMove?: (leadId: string, newStatus: Lead['status']) => void
}

const columns: { id: Lead['status']; label: string; color: string }[] = [
  { id: 'novo', label: 'Novos', color: 'bg-blue-100 border-blue-300' },
  { id: 'contato', label: 'Em Contato', color: 'bg-yellow-100 border-yellow-300' },
  { id: 'qualificado', label: 'Qualificados', color: 'bg-green-100 border-green-300' },
  { id: 'proposta', label: 'Proposta', color: 'bg-purple-100 border-purple-300' },
  { id: 'convertido', label: 'Convertidos', color: 'bg-emerald-100 border-emerald-300' },
]

export default function LeadsKanban({ leads, onLeadMove }: KanbanProps) {
  const [draggedLead, setDraggedLead] = useState<string | null>(null)
  const [localLeads, setLocalLeads] = useState(leads)

  const formatCurrency = (value?: number) => {
    if (!value) return 'Valor não informado'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const handleDragStart = (leadId: string) => {
    setDraggedLead(leadId)
  }

  const handleDragEnd = () => {
    setDraggedLead(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, newStatus: Lead['status']) => {
    e.preventDefault()
    
    if (!draggedLead) return

    // Atualizar localmente
    setLocalLeads(prev => 
      prev.map(lead => 
        lead.id === draggedLead ? { ...lead, status: newStatus } : lead
      )
    )

    // Callback para atualizar no servidor
    onLeadMove?.(draggedLead, newStatus)
    
    setDraggedLead(null)
  }

  const getLeadsByStatus = (status: Lead['status']) => {
    return localLeads.filter(lead => lead.status === status)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {columns.map(column => {
        const columnLeads = getLeadsByStatus(column.id)
        
        return (
          <div
            key={column.id}
            className={`rounded-lg border-2 ${column.color} min-h-[600px]`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Header da coluna */}
            <div className="p-4 border-b border-gray-300">
              <h3 className="font-semibold text-gray-900">{column.label}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {columnLeads.length} {columnLeads.length === 1 ? 'lead' : 'leads'}
              </p>
            </div>

            {/* Cards de leads */}
            <div className="p-3 space-y-3">
              {columnLeads.map(lead => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={() => handleDragStart(lead.id)}
                  onDragEnd={handleDragEnd}
                  className={`bg-white rounded-lg shadow-sm p-4 cursor-move hover:shadow-md transition-shadow ${
                    draggedLead === lead.id ? 'opacity-50' : ''
                  }`}
                >
                  {/* Nome e empresa */}
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-900">{lead.nome}</h4>
                    {lead.empresa && (
                      <p className="text-sm text-gray-500">{lead.empresa}</p>
                    )}
                  </div>

                  {/* Contato */}
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{lead.email}</span>
                    </div>
                    {lead.telefone && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Phone className="w-3 h-3" />
                        <span>{lead.telefone}</span>
                      </div>
                    )}
                  </div>

                  {/* Valor */}
                  {lead.valor_estimado && (
                    <div className="flex items-center gap-2 text-sm font-medium text-green-700 mb-2">
                      <DollarSign className="w-4 h-4" />
                      {formatCurrency(lead.valor_estimado)}
                    </div>
                  )}

                  {/* Origem e data */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {lead.origem}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(lead.created_at).toLocaleDateString('pt-BR', { 
                        day: '2-digit', 
                        month: 'short' 
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty state */}
              {columnLeads.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Arraste leads para cá
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
