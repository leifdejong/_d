# \_d

A dockerized, webpack powered **WordPress Asset Pipeline** offering the latest in Web 2.0 technologies in conjunction with traditional WordPress theme development.

## Included

- **Docker Environments** - :ship: say goodbye to LAMP!
- **Webpack Asset Pipeline** - :rocket: no more Gulp or Grunt tasks
- **Hot Reloading** - :fire: in WordPress? What!
- **ES6/PostCSS Stage 3 Presets** - :checkered_flag: for the win!
- **Auto Code Formatting and Linting** - :eyeglasses: always cool
- **Multi Instance Support** - :herb: everything in parallel
- **Conditional Loading of Post Type Assets**
- **Barebones and Highly Customizable**
- **Production Ready**

View the full list of [technologies](#technologies).

## Requirements

- [Docker](https://docs.docker.com/) (with docker-compose)
- [Node.js](http://nodejs.org/) (with NPM)
- [Yarn](https://yarnpkg.com/en/docs/install) (optional) - you can also use `npm run`

## Project Structure

- `/src` - contains all raw assets
- `/theme/dist` - contains all transpiled assets from `/src`
- `/theme` - contains all standard WordPress theme files

## Quick Start

To launch and activate:

1. Run: `yarn`
2. Run: `yarn serve`
3. Setup WordPress and Login (browser will automatically open)
4. Activate `_d` in `Appearance -> Themes`
5. Visit the theme and open the console

This stack will be avaliable at:

- WordPress: http://localhost:3000/
- phpMyAdmin: http://localhost:3001/ - (credentials in `docker-compose.yml`)

This task will:

- Lint and transpile `src` to `/theme/dist` with Webpack
- Enqueue `/theme/dist` for use in WordPress
- Run MySQL, WordPress, and phpMyAdmin using Docker
- Mount `/theme` into the WordPress docker container
- Persist WordPress and MySQL data to `/wordpress` and `/data`
- Serve WordPress with Webpack Dev Server using port `3000`

## Customization

We pack a lot into this stack but we don't prescribe how you use it.

### Theme

This framework comes preloaded with the [_s](https://github.com/Automattic/_s) WordPress Starter Theme. Not a fan?

1. Delete the contents of the `/theme` folder
2. Copy in your custom theme files to `/theme`
3. Add the following to the bottom of `/theme/functions.php`:

```php
/**
 * Enqueue distribution
 */
require get_template_directory() . '/dist/enqueue.php';
```

4. Run `yarn serve` and you're ready to go!

### Build

Want to add some dangerous new features to your build? Not happy with the current configurations?

- Add additional loaders to `webpack.config.js`
- Change your targeted browsers in `.browserlistrc`
- Add additional stage features in `.babelrc` and `.postcssrc`
- Change your linting configurations in `.eslintrc` and `.stylelintrc`

### Advanced

Want to add another `Conditional Post Type Asset`?

- Create a new file in `src/scripts/types/{type}.js`
- Create a new file in `src/styles/types/{type}.scss`
- Import `../../styles/types/{type}.scss` in `src/scripts/types/{type}.js`
- Add '`src/scripts/types/{type}.js` to `webpack.config.js` under the `entry` property
- Add the type name and WP function check in `bin/enqueue.php` under the `switch(true)` statement

## Deploy

To deploy this stack, ensure that your host machine meets the following [requirements](#requirements).\
Then run:

```bash
export MYSQL_USER={some_user}
export MYSQL_PASSWORD={some_password}
yarn
yarn deploy
```

This stack will be avaliable at:

- WordPress: http://{domain}/
- phpMyAdmin: http://{domain}:3001 - (credentials above)

This task will:

- Lint, transpile, optimize, and hash `src` to `/theme/dist` with Webpack
- Enqueue `/theme/dist` for use in WordPress
- Run MySQL, WordPress, and phpMyAdmin in production mode using Docker
- Mount `/theme` into the WordPress docker container
- Persist WordPress and MySQL data to `${HOME}/wordpress` and `${HOME}/data`
- Serve WordPress on port `80`

## Commands

Here is a full list of framework commands:

- Serve: `yarn serve` - serves the webpack static assets proxying to WordPress
- Build: `yarn build` - builds the webpack static assets
- Lint: `yarn lint` - lints `/src` scripts and styles
- Format: `yarn format` - formats `/src` scripts and styles
- Deploy: `yarn deploy` - builds, runs, and deploys the stack to production
- Clean: `yarn clean` - removes all generated files (**Caution**: deletes development data)
- Clean: `yarn wait` - waits for WordPress to fully boot up

## Docker Commands

Here is a full list of docker commands:

- Up: `yarn docker-up` - brings the docker environment up for development
- Up Prod: `yarn docker-up-prod` - brings the docker environment up for production
- Down: `yarn docker-down` - brings the docker environment down
- Restart: `yarn docker-restart` - restarts the docker environment
- Build: `yarn docker-build` - builds the docker environment for development
- Build Prod: `yarn docker-build-prod` - builds the docker environment for production
- Prune: `yarn docker-prune` - cleans all unused docker images and containers

## Technologies

Here is a full list of technoligies:

- Linters: [ESLint](https://eslint.org/) and [StyleLint](https://stylelint.io/)
- Code Formatters: [Prettier](https://prettier.io/), [husky](https://github.com/typicode/husky), [lint-staged](https://github.com/okonet/lint-staged)
- Compilers: [Babel](https://babeljs.io/), [node-sass](https://github.com/sass/node-sass), [PostCSS](https://postcss.org/)
- Wiring: [Docker](https://www.docker.com/) and [Webpack](https://webpack.js.org/)
- Presets:
  - [Babel Stage 3](https://github.com/babel/babel/blob/master/packages/babel-preset-stage-3/README.md)
  - [PostCSS Stage 3](https://github.com/csstools/postcss-preset-env)
  - [ESLint Airbnb Style Guide](https://github.com/airbnb/javascript)
  - [Stylelint Config Sass](https://github.com/bjankord/stylelint-config-sass-guidelines)

## FAQs

1. How do I stop docker? - `yarn docker-down`
2. How do I see running docker containers? - `docker ps`
3. How do I see a container's logs? - `docker logs -f <container_name>`
4. My disk is full, what do I do? - `yarn docker-prune`
5. What is `_d`? - pronounced "underscored", `_d` is a play on the original `_s`
