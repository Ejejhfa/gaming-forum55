export const dynamic = 'force-dynamic'
// src/app/admin/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Shield, Users, FileText, MessageSquare } from 'lucide-react'
import { AdminApplications } from '@/components/admin/AdminApplications'
import { DeleteButton } from '@/components/admin/DeleteButton'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') redirect('/')

  const [userCount, postCount, commentCount, recentUsers, pendingStreamers, pendingDiscord] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.comment.count(),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { id: true, name: true, username: true, email: true, role: true, createdAt: true, reputation: true },
    }),
    prisma.streamerApplication.findMany({
      where: { status: 'PENDING' },
      include: { user: { select: { username: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.discordApplication.findMany({
      where: { status: 'PENDING' },
      include: { user: { select: { username: true } } },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const recentPosts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      author: { select: { username: true } },
      category: { select: { name: true } },
    },
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Shield className="text-accent-light" size={28} />
        <div>
          <h1 className="font-display text-3xl font-bold text-white uppercase tracking-wider">Admin Panel</h1>
          <p className="text-text-muted text-sm">Manage your community</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Total Members', value: userCount, color: '#7c3aed' },
          { icon: FileText, label: 'Total Posts', value: postCount, color: '#10b981' },
          { icon: MessageSquare, label: 'Total Comments', value: commentCount, color: '#06b6d4' },
          { icon: Shield, label: 'Openstaande aanvragen', value: pendingStreamers.length + pendingDiscord.length, color: '#f59e0b' },
        ].map(stat => (
          <div key={stat.label} className="bg-bg-card border border-border rounded-xl p-4">
            <stat.icon size={20} style={{ color: stat.color }} className="mb-2" />
            <p className="font-display text-2xl font-bold text-white">{stat.value.toLocaleString()}</p>
            <p className="text-xs text-text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <AdminApplications pendingStreamers={pendingStreamers as any} pendingDiscord={pendingDiscord as any} />

      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-display font-bold text-white">Recent Members</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-xs text-text-muted font-semibold uppercase">User</th>
                <th className="text-left p-3 text-xs text-text-muted font-semibold uppercase">Email</th>
                <th className="text-left p-3 text-xs text-text-muted font-semibold uppercase">Role</th>
                <th className="text-left p-3 text-xs text-text-muted font-semibold uppercase">Rep</th>
                <th className="text-left p-3 text-xs text-text-muted font-semibold uppercase">Actie</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map(user => (
                <tr key={user.id} className="border-b border-border/50 hover:bg-bg-tertiary/50 transition-colors">
                  <td className="p-3">
                    <p className="font-medium text-text">{user.username}</p>
                    <p className="text-xs text-text-muted">{user.name}</p>
                  </td>
                  <td className="p-3 text-text-muted text-xs">{user.email}</td>
                  <td className="p-3">
                    <span className={`badge ${user.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' : 'bg-accent/20 text-accent-light'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-xs text-accent-light">{user.reputation}</td>
                  <td className="p-3">
                    {user.role !== 'ADMIN' && <DeleteButton type="user" id={user.id} redirectTo="/admin" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-display font-bold text-white">Recent Posts</h2>
        </div>
        <div className="divide-y divide-border/50">
          {recentPosts.map(post => (
            <div key={post.id} className="p-4 flex items-center justify-between hover:bg-bg-tertiary/50 transition-colors">
              <div>
                <p className="text-sm font-medium text-text line-clamp-1">{post.title}</p>
                <p className="text-xs text-text-muted">by {post.author.username} in {post.category.name}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-text-faint">{post.views} views</span>
                <a href={`/post/${post.slug}`} className="btn-ghost text-xs py-1">View</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
