import stylus from 'stylus';
import url from 'url';
import fs from 'fs';

export default (req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  const path = url.parse(req.url).pathname;
  if (!/\.css$/.test(path)) return next();
  const fileArr = path.split('.');
  fileArr.pop();
  const file = fileArr.join('.');
  try {
    const styl = fs.readFileSync(`${__dirname}/../src/assets/${file}.styl`, {
      encoding: 'utf8'
    });
    return stylus.render(styl, (err, css) => {
      res.header('Content-type', 'text/css');
      res.send(css);
    });
  } catch (stylusError) {
    try {
      const styl = fs.readFileSync(`${__dirname}/../src/assets/${file}.styl`, {
        encoding: 'utf8'
      });
      res.header('Content-type', 'text/css');
      return res.send(styl);
    } catch (cssError) {
      return next();
    }
  }
};
