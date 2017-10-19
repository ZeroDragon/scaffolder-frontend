import express from 'express';
import webpackMiddleware from 'webpack-dev-middleware';
import webpack from 'webpack';
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

app.listen(config.HTTP_SERVER_PORT, () => {
  logger.info(
    `Devserver Listening on http://localhost:${config.HTTP_SERVER_PORT}`
  );
});
