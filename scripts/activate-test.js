const { PrismaClient } = require('@prisma/client')
const db = new PrismaClient()

db.property.updateMany({ where: { status: 'PENDING' }, data: { status: 'ACTIVE' } })
  .then((r) => console.log('Activated:', r.count, 'properties'))
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect())
