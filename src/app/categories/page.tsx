export const dynamic = 'force-dynamic'
// src/app/categories/page.tsx
import { prisma } from '@/lib/prisma'
import { CategoryCard } from '@/components/categories/CategoryCard'

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { posts: true } } },
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold text-white uppercase tracking-wider mb-1">Categories</h1>
        <p className="text-text-muted text-sm">Browse all gaming topics and communities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="bg-bg-card border border-border rounded-xl p-5 card-hover">
            <div className="flex items-start gap-4">
              <div className="text-3xl">{cat.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-display font-bold text-white text-lg">{cat.name}</h3>
                  <span className="text-sm font-mono text-text-muted">{cat._count.posts} posts</span>
                </div>
                <p className="text-sm text-text-muted mb-3">{cat.description}</p>
                <a href={`/category/${cat.slug}`} className="btn-secondary text-xs py-1.5">
                  Browse Posts →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
