'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Tv, CheckCircle } from 'lucide-react'

export default function StreamerApplyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    twitchUrl: '',
    youtubeUrl: '',
    tiktokUrl: '',
    description: '',
    games: '',
    followers: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.description || !form.games || !form.followers) {
      setError('Vul alle verplichte velden in')
      return
    }
    if (!form.twitchUrl && !form.youtubeUrl && !form.tiktokUrl) {
      setError('Voeg minimaal één streamlink toe')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/streamers/apply', {
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
          We beoordelen je aanvraag zo snel mogelijk. Je hoort van ons via je profiel. Gemiddeld duurt dit 1–3 dagen.
        </p>
        <button onClick={() => router.push('/streamers')} className="btn-primary">
          Terug naar Streamers
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-xl space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-3">
          <Tv className="text-accent-light" /> Aanmelden als Streamer
        </h1>
        <p className="text-text-muted text-sm">
          Vul het formulier in en we plaatsen je op de GameHub streamers pagina na goedkeuring.
        </p>
      </div>

      {/* Info box */}
      <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 text-sm text-text-muted">
        <p className="font-semibold text-text mb-1">📋 Wat gebeurt er na je aanvraag?</p>
        <p>Een admin beoordeelt je aanvraag binnen 1–3 werkdagen. Bij goedkeuring verschijn je op de <strong className="text-text">/streamers</strong> pagina én wordt er automatisch een post aangemaakt in het forum.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-bg-card border border-border rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Streamer naam <span className="text-red-400">*</span>
          </label>
          <input type="text" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))}
            placeholder="Jouw streamnaam" className="input-gaming" />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Twitch URL</label>
            <input type="url" value={form.twitchUrl} onChange={e => setForm(p => ({...p, twitchUrl: e.target.value}))}
              placeholder="https://twitch.tv/jouwnaam" className="input-gaming" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">YouTube URL</label>
            <input type="url" value={form.youtubeUrl} onChange={e => setForm(p => ({...p, youtubeUrl: e.target.value}))}
              placeholder="https://youtube.com/@jouwnaam" className="input-gaming" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">TikTok URL</label>
            <input type="url" value={form.tiktokUrl} onChange={e => setForm(p => ({...p, tiktokUrl: e.target.value}))}
              placeholder="https://tiktok.com/@jouwnaam" className="input-gaming" />
          </div>
        </div>
        <p className="text-xs text-text-faint -mt-2">Vul minimaal één platform in</p>

        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Games die je streamt <span className="text-red-400">*</span>
          </label>
          <input type="text" value={form.games} onChange={e => setForm(p => ({...p, games: e.target.value}))}
            placeholder="Valorant, Elden Ring, Minecraft (komma gescheiden)" className="input-gaming" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Aantal volgers (totaal) <span className="text-red-400">*</span>
          </label>
          <input type="text" value={form.followers} onChange={e => setForm(p => ({...p, followers: e.target.value}))}
            placeholder="bijv. 500, 2.000, 10k+" className="input-gaming" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Vertel over jezelf <span className="text-red-400">*</span>
          </label>
          <textarea value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))}
            placeholder="Wie ben je, wat stream je, waarom wil je op GameHub staan?" rows={4}
            className="input-gaming resize-none" />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400">{error}</div>
        )}

        <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-3">
          {submitting ? 'Versturen...' : '🚀 Aanvraag Indienen'}
        </button>
      </form>
    </div>
  )
}
