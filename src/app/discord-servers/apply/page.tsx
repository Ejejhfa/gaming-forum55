'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { MessageCircle, CheckCircle } from 'lucide-react'

export default function DiscordApplyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [form, setForm] = useState({
    serverName: '',
    inviteUrl: '',
    description: '',
    memberCount: '',
    focus: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.serverName || !form.inviteUrl || !form.description || !form.memberCount || !form.focus) {
      setError('Vul alle velden in')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/discord/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) setSubmitted(true)
      else setError(data.error || 'Er ging iets mis')
    } catch { setError('Er ging iets mis') }
    setSubmitting(false)
  }

  if (status === 'loading') return <div className="text-text-muted text-center py-20">Laden...</div>

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 animate-fade-in">
        <CheckCircle size={48} className="text-neon-green mx-auto mb-4" />
        <h1 className="font-display text-3xl font-bold text-white mb-2">Aanvraag ingediend!</h1>
        <p className="text-text-muted mb-6">
          We beoordelen je server zo snel mogelijk. Bij goedkeuring verschijnt hij op de servers pagina. Gemiddeld duurt dit 1–3 dagen.
        </p>
        <button onClick={() => router.push('/discord-servers')} className="btn-primary">
          Terug naar Servers
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-xl space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-3">
          <MessageCircle className="text-indigo-400" /> Discord Server Aanmelden
        </h1>
        <p className="text-text-muted text-sm">
          Meld je Discord server aan voor promotie op GameHub. Na goedkeuring door een admin wordt je server geplaatst.
        </p>
      </div>

      {/* Info box */}
      <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 text-sm text-text-muted">
        <p className="font-semibold text-text mb-1">📋 Vereisten</p>
        <ul className="space-y-1">
          <li>✓ Server moet actief zijn (minimaal 10 leden)</li>
          <li>✓ Permanente invite link vereist</li>
          <li>✓ Server moet gaming gerelateerd zijn</li>
          <li>✓ Geen 18+ of illegale content</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="bg-bg-card border border-border rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Server naam <span className="text-red-400">*</span>
          </label>
          <input type="text" value={form.serverName} onChange={e => setForm(p => ({...p, serverName: e.target.value}))}
            placeholder="Naam van je Discord server" className="input-gaming" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Permanente invite link <span className="text-red-400">*</span>
          </label>
          <input type="url" value={form.inviteUrl} onChange={e => setForm(p => ({...p, inviteUrl: e.target.value}))}
            placeholder="https://discord.gg/jouwserver" className="input-gaming" />
          <p className="text-xs text-text-faint mt-1">Maak een permanente invite aan via Server instellingen → Invites</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Aantal leden <span className="text-red-400">*</span>
          </label>
          <input type="text" value={form.memberCount} onChange={e => setForm(p => ({...p, memberCount: e.target.value}))}
            placeholder="bijv. 50, 500, 2.000" className="input-gaming" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Focus / type server <span className="text-red-400">*</span>
          </label>
          <input type="text" value={form.focus} onChange={e => setForm(p => ({...p, focus: e.target.value}))}
            placeholder="bijv. FPS gaming, Minecraft, Esports, Algemeen gaming" className="input-gaming" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Beschrijving <span className="text-red-400">*</span>
          </label>
          <textarea value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))}
            placeholder="Vertel over je server, wat maakt hem speciaal, wat kunnen leden verwachten?" rows={4}
            className="input-gaming resize-none" />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400">{error}</div>
        )}

        <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-3">
          {submitting ? 'Versturen...' : '💬 Aanvraag Indienen'}
        </button>
      </form>
    </div>
  )
}
