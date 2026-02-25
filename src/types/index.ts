// src/types/index.ts
import { User, Post, Category, Comment, Tag } from '@prisma/client'

export type PostWithDetails = Post & {
  author: Pick<User, 'id' | 'name' | 'username' | 'avatar' | 'reputation' | 'gamertag'>
  category: Category
  _count: { comments: number; likes: number }
  tags: Tag[]
}

export type CommentWithDetails = Comment & {
  author: Pick<User, 'id' | 'name' | 'username' | 'avatar' | 'reputation'>
  _count: { likes: number; replies: number }
  replies?: CommentWithDetails[]
}

export type CategoryWithCount = Category & {
  _count: { posts: number }
}

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      username: string
      role: string
      image?: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    username: string
    role: string
  }
}
