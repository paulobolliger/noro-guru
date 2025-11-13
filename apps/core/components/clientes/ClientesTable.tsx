// apps/core/components/clientes/ClientesTable.tsx
'use client'

import { useState } from 'react'
import { Building2, Mail, Phone, Calendar, MapPin, MoreVertical, Eye, Edit, Trash, DollarSign } from 'lucide-react'

interface Cliente {
  id: string
  nome: string
  email: string
  telefone?: string
  empresa?: string
  cpf_cnpj?: string
  endereco?: string
  cidade?: string
  uf?: string
  status: 'ativo' | 'inativo' | 'bloqueado'
  total_compras?: number
  ultima_compra?: string
  created_at: string
}

interface ClientesTableProps {
  clientes: Cliente[]
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

const statusColors = {
  ativo: 'bg-green-100 text-green-800',
  inativo: 'bg-gray-100 text-gray-800',
  bloqueado: 'bg-red-100 text-red-800',
}

const statusLabels = {
  ativo: 'Ativo',
  inativo: 'Inativo',
  bloqueado: 'Bloqueado',
}

export default function ClientesTable({ clientes, onView, onEdit, onDelete }: ClientesTableProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const formatCurrency = (value?: number) => {
    if (!value) return 'R$ 0,00'
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
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contato
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Localização
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Compras
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente desde
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{cliente.nome}</div>
                      {cliente.empresa && (
                        <div className="text-sm text-gray-500">{cliente.empresa}</div>
                      )}
                      {cliente.cpf_cnpj && (
                        <div className="text-xs text-gray-400">{cliente.cpf_cnpj}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center gap-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {cliente.email}
                  </div>
                  {cliente.telefone && (
                    <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {cliente.telefone}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {cliente.cidade && cliente.uf ? (
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {cliente.cidade}/{cliente.uf}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[cliente.status]}`}>
                    {statusLabels[cliente.status]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-sm text-gray-900 font-medium">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    {formatCurrency(cliente.total_compras)}
                  </div>
                  {cliente.ultima_compra && (
                    <div className="text-xs text-gray-500 mt-1">
                      Última: {formatDate(cliente.ultima_compra)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {formatDate(cliente.created_at)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative inline-block">
                    <button
                      onClick={() => setOpenMenu(openMenu === cliente.id ? null : cliente.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                    
                    {openMenu === cliente.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                        <button
                          onClick={() => {
                            onView?.(cliente.id)
                            setOpenMenu(null)
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Visualizar
                        </button>
                        <button
                          onClick={() => {
                            onEdit?.(cliente.id)
                            setOpenMenu(null)
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            onDelete?.(cliente.id)
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
