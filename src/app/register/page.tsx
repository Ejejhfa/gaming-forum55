'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', gamertag: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Registration failed')
      } else {
        await signIn('credentials', { email: form.email, password: form.password, redirect: false })
        router.push('/')
      }
    } catch {
      setError('Something went wrong')
    }
    setLoading(false)
  }

  const field = (key: keyof typeof form, label: string, type = 'text', placeholder = '', required = true) => (
    <div>
      <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
        placeholder={placeholder}
        required={required}
        className="input-gaming"
      />
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent glow-purple mb-4">
            <Zap size={28} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Join GameHub</h1>
          <p className="text-text-muted text-sm mt-2">Create your account and start gaming</p>
        </div>

        <div className="bg-bg-card border border-border rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {field('name', 'Display Name', 'text', 'Your name')}
            {field('username', 'Username', 'text', 'your_username')}
            {field('email', 'Email', 'email', 'you@example.com')}
            {field('password', 'Password', 'password', '••••••••')}
            {field('gamertag', 'Gamertag', 'text', 'YourName#1234', false)}

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">{error}</div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading ? 'Creating account...' : '🎮 Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-text-muted">
            Already have an account?{' '}
            <Link href="/login" className="text-accent-light hover:text-accent transition-colors font-medium">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
