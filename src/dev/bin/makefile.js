import webpack from 'webpack'
import stylus from 'stylus'
import { clone } from 'lodash'
import { readFileSync, writeFileSync, unlinkSync } from 'fs'
import mkdirp from 'mkdirp'
import pug from 'pug'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'
import uglifycss from 'uglifycss'
import { latest as latestTag } from 'git-tags'
import { promisify } from 'util'

const webpackAsync = promisify(webpack)
const mkdirpAsync = promisify(mkdirp)
const stylusRenderAsync = promisify(stylus.render)
const latestTagAsync = promisify(latestTag)

const bundleScripts = async () => {
  const latest = await latestTagAsync()
  logger.info('Bundling JS file')
  return webpackAsync({
    entry: './src/assets/scripts/index.js',
    output: {
      filename: 'bundle.js',
      path: `${__dirname}/../dist/${latest}/scripts/`
    },
    plugins: [new UglifyJSPlugin()]
  })
}

const bundleStyles = async ({ files = [] }) => {
  const latest = await latestTagAsync()
  logger.info('Bundling CSS files')
  const originPath = `${__dirname}/../src/assets/styles/`
  const destinationPath = `${__dirname}/../dist/${latest}/styles/`
  const styleFiles = clone(files)
  const promiseBuilder = styleFiles.map(
    ({ file }) =>
      new Promise(async resolve => {
        const src = readFileSync(`${originPath}${file}`, {
          encoding: 'utf8'
        })
        const prettyCSS = await stylusRenderAsync(src)
        await mkdirpAsync(destinationPath)
        const cleanName = file.replace('.styl', '')
        writeFileSync(`${destinationPath}${cleanName}.temp.css`, prettyCSS)
        const uglyCSS = uglifycss.processFiles(
          [`${destinationPath}${cleanName}.temp.css`],
          { maxLineLen: 500 }
        )
        writeFileSync(`${destinationPath}${cleanName}.css`, uglyCSS)
        unlinkSync(`${destinationPath}${cleanName}.temp.css`)
        logger.info(`${cleanName}.css done`)
        return resolve()
      })
  )
  return Promise.all(promiseBuilder)
}

const bundleHTML = async ({ files = [] }) => {
  const latest = await latestTagAsync()
  logger.info('Bundling HTML files')
  const originPath = `${__dirname}/../src/views/`
  const destinationPath = `${__dirname}/../dist/${latest}/`
  const styleFiles = clone(files)
  const promiseBuilder = styleFiles.map(
    ({ file, opts = {} }) =>
      new Promise(resolve => {
        const html = pug.renderFile(`${originPath}${file}`, opts)
        const cleanName = file.replace('.pug', '')
        writeFileSync(`${destinationPath}${cleanName}.html`, html)
        logger.info(`${cleanName}.html done`)
        resolve()
      })
  )
  return Promise.all(promiseBuilder)
}

const worker = async () => {
  const latest = await latestTagAsync()
  logger.info(`Building app to ./dist/${latest}`)
  await bundleScripts()
  await bundleStyles({
    files: [{ file: 'index.styl' }]
  })
  await bundleHTML({
    files: [{ file: 'index.pug' }]
  })
}

worker()
