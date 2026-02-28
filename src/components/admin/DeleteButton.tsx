'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export function DeleteButton({ type, id, redirectTo }: {
  type: 'post' | 'comment'
  id: string
  redirectTo?: string
}) {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [confirm, setConfirm] = useState(false)

  if (session?.user?.role !== 'ADMIN') return null

  const handleDelete = async () => {
    if (!confirm) {
      setConfirm(true)
      setTimeout(() => setConfirm(false), 3000)
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/admin/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id }),
      })
      if (res.ok) {
        if (redirectTo) router.push(redirectTo)
        else window.location.reload()
      }
    } catch {}
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        confirm
          ? 'bg-red-500 text-white animate-pulse'
          : 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20'
      }`}
    >
      <Trash2 size={12} />
      {loading ? 'Verwijderen...' : confirm ? 'Klik nogmaals om te bevestigen' : 'Verwijderen'}
    </button>
  )
}
