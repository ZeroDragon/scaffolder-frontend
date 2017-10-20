import express from 'express';
import webpackMiddleware from 'webpack-dev-middleware';
import webpack from 'webpack';
import liveReload from 'easy-livereload';
import openbrowser from 'openbrowser';
import stylusMiddleware from './stylusMiddleware';

const app = express();

app.set('views', `${__dirname}/../src/views/`);
app.use(
  webpackMiddleware(
    webpack({
      entry: './src/assets/scripts/index.js',
      output: {
        filename: 'bundle.js',
        path: '/'
      }
    }),
    {
      publicPath: '/scripts/',
      noInfo: true
    }
  )
);
app.use(stylusMiddleware);
app.use(express.static(`${__dirname}/../src/assets`));

app.get('/', (req, res) => {
  res.render('index.pug', { pretty: true });
});

const fileTypeMap = {
  pug: 'html',
  styl: 'css',
  js: 'js'
};
const fileTypeRegex = new RegExp(`\\.(${Object.keys(fileTypeMap).join('|')})$`);
app.use(
  liveReload({
    app,
    watchDirs: [`${__dirname}/../src`],
    checkFunc: file => fileTypeRegex.test(file),
    renameFunc: file =>
      file.replace(fileTypeRegex, ext => `.${fileTypeMap[ext.slice(1)]}`)
  })
);

app.listen(config.HTTP_SERVER_PORT, () => {
  const url = `http://localhost:${config.HTTP_SERVER_PORT}`;
  openbrowser(url);
  logger.info(`Devserver Listening on ${url}`);
});
