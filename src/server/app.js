
import Express from 'express'
import { resolve } from 'path'

const app = new Express()
const staticPath = resolve(process.cwd(), 'docs')
app.use(Express.static(staticPath))

const {
  RINGCENTRAL_PORT: port,
  RINGCENTRAL_HOST: host
} = process.env

app.listen(port, host, () => {
  console.log(`-> server running at: http://${host}:${port}`)
})
