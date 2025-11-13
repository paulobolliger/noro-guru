'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'

interface TopBarProps {
  user: {
    email?: string
    nome?: string
  }
}

export default function TopBar({ user }: TopBarProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    // TEMPORÁRIO: Desabilitado para desenvolvimento
    console.log('Logout desabilitado em desenvolvimento')
    // await supabase.auth.signOut()
    // router.push('/login')
    // router.refresh()
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Bem-vindo de volta!
          </h2>
          <p className="text-sm text-gray-500">
            Confira as últimas atualizações do seu negócio
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user.nome || user.email}
              </p>
              <p className="text-xs text-gray-500">Tenant</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
