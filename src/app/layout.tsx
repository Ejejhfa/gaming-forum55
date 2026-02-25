// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'

export const metadata: Metadata = {
  title: 'GameHub — Gaming Community',
  description: 'The ultimate forum for gamers. Discuss games, find teammates, and connect with the gaming community.',
  keywords: ['gaming', 'forum', 'community', 'esports', 'games'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-bg min-h-screen">
        <Providers>
          <div className="min-h-screen bg-bg bg-grid">
            {/* Hero gradient overlay */}
            <div className="fixed inset-0 bg-hero-gradient pointer-events-none" />
            <Navbar />
            <div className="relative z-10 max-w-7xl mx-auto px-4 pt-6 pb-16">
              <div className="flex gap-6">
                <main className="flex-1 min-w-0">{children}</main>
                <Sidebar />
              </div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
