// src/components/categories/CategoryCard.tsx
import Link from 'next/link'
import { CategoryWithCount } from '@/types'

export function CategoryCard({ category }: { category: CategoryWithCount }) {
  return (
    <Link href={`/category/${category.slug}`}>
      <div className="bg-bg-card border border-border rounded-xl p-4 card-hover cursor-pointer group">
        <div className="text-2xl mb-2">{category.icon}</div>
        <h3 className="font-display font-bold text-sm text-text group-hover:text-white transition-colors leading-tight mb-1">
          {category.name}
        </h3>
        <p className="text-xs text-text-muted line-clamp-2 mb-2">{category.description}</p>
        <p className="text-xs font-mono" style={{ color: category.color ?? '#7c3aed' }}>
          {category._count.posts} posts
        </p>
      </div>
    </Link>
  )
}
