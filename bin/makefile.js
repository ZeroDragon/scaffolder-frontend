import webpack from 'webpack';
import stylus from 'stylus';
import { clone } from 'lodash';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import mkdirp from 'mkdirp';
import pug from 'pug';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import uglifycss from 'uglifycss';

logger.info('Building app to ./dist');

const bundleScripts = () => {
  logger.info('Bundling JS file');
  return new Promise((resolve, reject) => {
    webpack(
      {
        entry: './src/assets/scripts/index.js',
        output: {
          filename: 'bundle.js',
          path: `${__dirname}/../dist/scripts/`
        },
        plugins: [new UglifyJSPlugin()]
      },
      (err, stats) => {
        if (err) return reject(err);
        logger.info('bundle.js done');
        return resolve(stats);
      }
    );
  });
};

const bundleStyles = ({ files = [] }) => {
  logger.info('Bundling CSS files');
  const originPath = `${__dirname}/../src/assets/styles/`;
  const destinationPath = `${__dirname}/../dist/styles/`;
  const styleFiles = clone(files);
  const promiseBuilder = styleFiles.map(
    ({ file }) =>
      new Promise(async (resolve, reject) => {
        const src = readFileSync(`${originPath}${file}`, {
          encoding: 'utf8'
        });
        const prettyCSS = await new Promise(resolveStylus => {
          stylus(src).render((err, resultCSS) => {
            if (err) return reject(err);
            return resolveStylus(resultCSS);
          });
        });
        await new Promise(resolveMkdirp => {
          mkdirp(destinationPath, err => {
            if (err) return reject(err);
            return resolveMkdirp();
          });
        });
        const cleanName = file.replace('.styl', '');
        writeFileSync(`${destinationPath}${cleanName}.temp.css`, prettyCSS);
        const uglyCSS = uglifycss.processFiles(
          [`${destinationPath}${cleanName}.temp.css`],
          { maxLineLen: 500 }
        );
        writeFileSync(`${destinationPath}${cleanName}.css`, uglyCSS);
        unlinkSync(`${destinationPath}${cleanName}.temp.css`);
        logger.info(`${cleanName}.css done`);
        return resolve();
      })
  );
  return Promise.all(promiseBuilder);
};

const bundleHTML = ({ files = [] }) => {
  logger.info('Bundling HTML files');
  const originPath = `${__dirname}/../src/views/`;
  const destinationPath = `${__dirname}/../dist/`;
  const styleFiles = clone(files);
  const promiseBuilder = styleFiles.map(
    ({ file, opts = {} }) =>
      new Promise(resolve => {
        const html = pug.renderFile(`${originPath}${file}`, opts);
        const cleanName = file.replace('.pug', '');
        writeFileSync(`${destinationPath}${cleanName}.html`, html);
        logger.info(`${cleanName}.html done`);
        resolve();
      })
  );
  return Promise.all(promiseBuilder);
};

const worker = async () => {
  await bundleScripts();
  await bundleStyles({
    files: [{ file: 'index.styl' }]
  });
  await bundleHTML({
    files: [{ file: 'index.pug' }]
  });
};

worker();
