// apps/core/components/leads/LeadsTable.tsx
'use client'

import { useState } from 'react'
import { Users, Mail, Phone, Calendar, Tag, MoreVertical, Eye, Edit, Trash } from 'lucide-react'

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

interface LeadsTableProps {
  leads: Lead[]
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

const statusColors = {
  novo: 'bg-blue-100 text-blue-800',
  contato: 'bg-yellow-100 text-yellow-800',
  qualificado: 'bg-green-100 text-green-800',
  proposta: 'bg-purple-100 text-purple-800',
  convertido: 'bg-emerald-100 text-emerald-800',
  perdido: 'bg-red-100 text-red-800',
}

const statusLabels = {
  novo: 'Novo',
  contato: 'Em Contato',
  qualificado: 'Qualificado',
  proposta: 'Proposta Enviada',
  convertido: 'Convertido',
  perdido: 'Perdido',
}

export default function LeadsTable({ leads, onView, onEdit, onDelete }: LeadsTableProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const formatCurrency = (value?: number) => {
    if (!value) return '-'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lead
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contato
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Origem
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor Est.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{lead.nome}</div>
                      {lead.empresa && (
                        <div className="text-sm text-gray-500">{lead.empresa}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center gap-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {lead.email}
                  </div>
                  {lead.telefone && (
                    <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {lead.telefone}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[lead.status]}`}>
                    {statusLabels[lead.status]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-sm text-gray-900">
                    <Tag className="w-4 h-4 text-gray-400" />
                    {lead.origem}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(lead.valor_estimado)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {formatDate(lead.created_at)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative inline-block">
                    <button
                      onClick={() => setOpenMenu(openMenu === lead.id ? null : lead.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                    
                    {openMenu === lead.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                        <button
                          onClick={() => {
                            onView?.(lead.id)
                            setOpenMenu(null)
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Visualizar
                        </button>
                        <button
                          onClick={() => {
                            onEdit?.(lead.id)
                            setOpenMenu(null)
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            onDelete?.(lead.id)
                            setOpenMenu(null)
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash className="w-4 h-4" />
                          Excluir
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
