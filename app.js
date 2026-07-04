const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const fs = require('fs')
const path = require('path')

// Remove Next.js dev lock so production start isn't blocked
const devDir = path.join(__dirname, '.next', 'dev')
try { fs.rmSync(devDir, { recursive: true, force: true }) } catch {}

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'

const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Prestolet ready on port ${port}`)
  })
})
