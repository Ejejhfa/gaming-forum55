// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function slugify(text: string) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { title, content, categoryId, tags } = await req.json()

    if (!title?.trim() || !content?.trim() || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const baseSlug = slugify(title)
    const existing = await prisma.post.findUnique({ where: { slug: baseSlug } })
    const slug = existing ? `${baseSlug}-${Date.now()}` : baseSlug

    // Process tags
    const tagNames = tags ? tags.split(',').map((t: string) => t.trim().toLowerCase()).filter(Boolean).slice(0, 5) : []
    const tagConnectOrCreate = tagNames.map((name: string) => ({
      where: { name },
      create: { name },
    }))

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        slug,
        authorId: session.user.id,
        categoryId,
        tags: { connectOrCreate: tagConnectOrCreate },
      },
    })

    return NextResponse.json({ slug: post.slug }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
