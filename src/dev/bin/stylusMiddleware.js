import stylus from 'stylus'
import url from 'url'
import fs from 'fs'

const srcPath = `${__dirname}/../..`

export default (req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next()
  const path = url.parse(req.url).pathname
  if (!/\.css$/.test(path)) return next()
  const fileArr = path.split('.')
  fileArr.pop()
  const file = fileArr.join('.')
  try {
    const styl = fs.readFileSync(`${srcPath}/assets/${file}.styl`, {
      encoding: 'utf8'
    })
    return stylus.render(styl, (err, css) => {
      if (err) return next()
      res.header('Content-type', 'text/css')
      res.send(css)
    })
  } catch (stylusError) {
    try {
      const styl = fs.readFileSync(`${srcPath}/assets/${file}.styl`, {
        encoding: 'utf8'
      })
      res.header('Content-type', 'text/css')
      return res.send(styl)
    } catch (cssError) {
      return next()
    }
  }
}
