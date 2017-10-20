# MANDADITOS ADMIN

This is the administration page for mandaditos.
This place is designed to CRUD Users, Vendors, Products, Orders, etc...


This project was kickstarted with this features:
  - jest
  - dotenv
  - babel
  - bunyan
  - eslint
  - pretty
  - vscode conf
  - editorconfig
  - nodemon
  - precommit hooks
  - dev server that compiles on the fly
    - webpack
    - pug
    - stylus
  - build script that generates static files at `./dist`

## USAGE

just `cd` to your repository (created based on this one) and:

- `yarn dev` - to start working. This will fire a browser with the index with live reload
- `yarn test` - to run tests
- `yarn test src/path/to/your/file.test.js` to sun specific test
- `git commit` - run this without message after adding files to stage to run ESLint on staged files
- `yarn build` - will build current `./src` to `./dist/<latest-tag>`
- `yarn test-build` - will create a simple httpserver to test static files at `./dist`
