// src/app/api/posts/like/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { postId } = await req.json()

  const existing = await prisma.like.findUnique({
    where: { userId_postId: { userId: session.user.id, postId } },
  })

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } })
    return NextResponse.json({ liked: false })
  } else {
    await prisma.like.create({ data: { userId: session.user.id, postId } })
    return NextResponse.json({ liked: true })
  }
}
