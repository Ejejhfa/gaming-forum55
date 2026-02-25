// prisma/seed.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gamehub.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@gamehub.com',
      username: 'admin',
      password: hashedPassword,
      gamertag: 'GameHub#0001',
      role: 'ADMIN',
      reputation: 9999,
      bio: 'The founder of GameHub Community.',
    },
  })

  // Create categories
  const categories = [
    { name: 'General Gaming', slug: 'general', description: 'Talk about anything gaming related', icon: '🎮', color: '#6366f1', order: 1 },
    { name: 'PC Gaming', slug: 'pc-gaming', description: 'PC builds, hardware, and gaming on PC', icon: '💻', color: '#8b5cf6', order: 2 },
    { name: 'Console Gaming', slug: 'console', description: 'PlayStation, Xbox, Nintendo discussions', icon: '🕹️', color: '#ec4899', order: 3 },
    { name: 'FPS & Shooters', slug: 'fps', description: 'Call of Duty, Valorant, CS2 and more', icon: '🎯', color: '#ef4444', order: 4 },
    { name: 'RPG & Open World', slug: 'rpg', description: 'Elden Ring, Skyrim, The Witcher and more', icon: '⚔️', color: '#f59e0b', order: 5 },
    { name: 'Esports', slug: 'esports', description: 'Competitive gaming, tournaments, teams', icon: '🏆', color: '#10b981', order: 6 },
    { name: 'Game Deals', slug: 'deals', description: 'Share the best gaming deals and sales', icon: '💸', color: '#06b6d4', order: 7 },
    { name: 'Looking For Group', slug: 'lfg', description: 'Find teammates and gaming buddies', icon: '👥', color: '#84cc16', order: 8 },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  const generalCat = await prisma.category.findUnique({ where: { slug: 'general' } })
  const fpsCat = await prisma.category.findUnique({ where: { slug: 'fps' } })
  const rpgCat = await prisma.category.findUnique({ where: { slug: 'rpg' } })

  // Create sample posts
  await prisma.post.upsert({
    where: { slug: 'welcome-to-gamehub' },
    update: {},
    create: {
      title: '🎮 Welcome to GameHub Community!',
      slug: 'welcome-to-gamehub',
      content: `Welcome to GameHub, the ultimate gaming community!

Here you can discuss your favorite games, find teammates, share tips and tricks, and connect with fellow gamers from around the world.

**Community Rules:**
1. Be respectful to all members
2. No spam or self-promotion without permission  
3. Keep discussions on-topic in each category
4. No piracy or cheating discussions
5. Have fun and game on! 🎮

Feel free to introduce yourself in the General Gaming section and let us know what games you're playing!`,
      pinned: true,
      authorId: admin.id,
      categoryId: generalCat.id,
      views: 1234,
    },
  })

  await prisma.post.upsert({
    where: { slug: 'valorant-tips-for-beginners' },
    update: {},
    create: {
      title: 'Top 10 Valorant Tips for Beginners in 2024',
      slug: 'valorant-tips-for-beginners',
      content: `Just started playing Valorant? Here are my top tips to get you started on the right foot.

**1. Learn the maps first**
Before worrying about aiming, learn the callouts and common angles on each map.

**2. Play deathmatch daily**
Spend 15 minutes in deathmatch before ranked to warm up your aim.

**3. Don't forget to buy shields**
Light shields (400 credits) can save your life. Always buy them if you can afford it.

**4. Communicate with your team**
Use voice or text chat to call out enemy positions. Information wins rounds.

**5. Play one agent to mastery**
Pick one agent and stick with it until you understand their kit fully.`,
      authorId: admin.id,
      categoryId: fpsCat.id,
      views: 856,
    },
  })

  await prisma.post.upsert({
    where: { slug: 'elden-ring-hidden-secrets' },
    update: {},
    create: {
      title: 'Hidden Secrets in Elden Ring You Probably Missed',
      slug: 'elden-ring-hidden-secrets',
      content: `After 500+ hours in the Lands Between, I'm still finding new things. Here are some secrets you might have missed.

**The Frenzied Flame Ending**
Did you know there's a secret ending locked behind the Three Fingers? You need to visit the Subterranean Shunning-Grounds beneath Leyndell.

**Mohg's Hidden Realm**
Mohgwyn Palace is one of the most hidden areas in the game. You can reach it either through Varre's questline or a teleporter in the Consecrated Snowfield.

**The Walking Mausoleum Trick**
You can duplicate any remembrance by finding a Walking Mausoleum. Strike the white barnacles on its legs to make it kneel.`,
      authorId: admin.id,
      categoryId: rpgCat.id,
      views: 2341,
    },
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
