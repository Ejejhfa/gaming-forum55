export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [userCount, postCount, commentCount, trending, topUsers] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.comment.count(),
      prisma.post.findMany({
        orderBy: { views: 'desc' },
        take: 5,
        select: { id: true, title: true, slug: true, views: true },
      }),
      prisma.user.findMany({
        orderBy: { reputation: 'desc' },
        take: 5,
        select: { id: true, username: true, name: true, reputation: true },
      }),
    ])
    return NextResponse.json({ stats: { userCount, postCount, commentCount }, trending, topUsers })
  } catch {
    return NextResponse.json({ stats: { userCount: 0, postCount: 0, commentCount: 0 }, trending: [], topUsers: [] })
  }
}
