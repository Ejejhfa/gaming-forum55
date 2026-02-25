'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Settings, Save } from 'lucide-react'

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [form, setForm] = useState({ name: '', bio: '', gamertag: '' })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch {}
    setSaving(false)
  }

  if (status === 'loading') return <div className="text-text-muted text-center py-20">Loading...</div>

  return (
    <div className="max-w-lg space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-3">
          <Settings className="text-accent-light" /> Settings
        </h1>
        <p className="text-text-muted text-sm">Manage your profile and preferences</p>
      </div>

      <form onSubmit={handleSave} className="bg-bg-card border border-border rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Display Name</label>
          <input type="text" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))}
            placeholder={session?.user?.name || 'Your name'} className="input-gaming" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Gamertag</label>
          <input type="text" value={form.gamertag} onChange={e => setForm(p => ({...p, gamertag: e.target.value}))}
            placeholder="YourName#1234" className="input-gaming" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Bio</label>
          <textarea value={form.bio} onChange={e => setForm(p => ({...p, bio: e.target.value}))}
            placeholder="Tell the community about yourself..." rows={3} className="input-gaming resize-none" />
        </div>

        {success && (
          <div className="bg-neon-green/10 border border-neon-green/30 rounded-lg p-3 text-sm text-neon-green">
            ✓ Settings saved successfully!
          </div>
        )}

        <button type="submit" disabled={saving} className="btn-primary">
          <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
