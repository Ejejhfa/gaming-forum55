// src/app/api/comments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { postId, content, parentId } = await req.json()

    if (!postId || !content?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check post isn't locked
    const post = await prisma.post.findUnique({ where: { id: postId } })
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    if (post.locked) return NextResponse.json({ error: 'Post is locked' }, { status: 403 })

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        authorId: session.user.id,
        postId,
        parentId: parentId || null,
      },
    })

    // Increase author reputation
    await prisma.user.update({
      where: { id: session.user.id },
      data: { reputation: { increment: 1 } },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}
