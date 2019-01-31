# \_d

A dockerized, webpack powered WordPress theme inspired by [\_s](https://github.com/Automattic/_s).
Provides the lastest Web 2.0 features for your WordPress development environment.

## Table of Contents
- [Features](#features)
- [Requirements](#requirements)
- [File Structure](#file-structure)
- [Quick Start](#quick-start)
- [Customize](#customize)
- [Deploy](#deploy)
- [Script Commands](#script-commands)
- [Docker Commands](#docker-commands)
- [FAQs](#faqs)

## Features

- Dockerized WordPress Environment
- Webpack Asset Pipeline
- Hot Reloading Workflow
- Auto Code Formatting and Linting
- Conditional Loading of Post Type Assets
- Latest Stage 3 Presets
- Barebones and Highly Customizable
- Production Ready

## Requirements

- [Docker](https://docs.docker.com/) (with docker-compose) - runs WordPress, MySQL, and phpMyAdmin
- [Node.js](http://nodejs.org/) (with NPM) - run the Webpack asset pipline
- [Yarn](https://yarnpkg.com/en/docs/install) (optional) - manages dependencies and running scripts (you can also use `npm`)

## File Structure

- `/src` - contains all raw assets
- `/theme/dist` - contains all compiled assets from `/src`
- `/theme` - contains all WordPress theme files

## Quick Start

To launch WordPress and activate this theme:

1. Run: `yarn`
2. Run: `yarn serve`
3. Setup WordPress - browser will open automatically
4. Activate and visit the theme (Appearance -> Themes)
5. Open the console

The stack will be avaliable from:

- WordPress: http://localhost:3000/
- phpMyAdmin: http://localhost:3001/ - credentials avaliable in `docker-compose.yml`
- data - your data will be mapped to `/data` and `/wordpress`

## Customize
We pack a lot into this stack but we don't prescribe how you should use it.

### Theme
Not a fan of `_s` and want to use your own custom theme? No problem!

1. Delete the contents of the `/theme` folder.
2. Copy your theme files to the `/theme` folder.
3. Add the following to the bottom of `/theme/functions.php`:

```php
/**
 * Enqueue distribution
 */
require get_template_directory() . '/dist/enqueue.php';
```

4. Run `yarn serve` and you're ready to go!

### Build
Want to add some more dangerous new features to your build? Not happy with the configurations? No Problem!

- Add additional loaders to `webpack.config.js`
- Change your targeted browsers in `.browserlistrc`
- Add additional stage features in `.babelrc` and `.postcssrc`
- Change you linting configurations in `.eslintrc` and `.stylelintrc`
- To add another `Conditonal Post Type`:
  - Create a new file in `src/scripts/types/{type}.js`
  - Create a new file in `src/styles/types/{type}.scss`
  - Import `../../styles/types/{type}.scss` in `src/scripts/types/{type}.js`
  - Add '`src/scripts/types/{type}.js` to `webpack.config.js` under the `entry` property
  - Add the type name and WP function check in `bin/enqueue.php` under the `switch(true)` statement

### Rename

To rename this theme, simply edit the `name` property in `theme/styles.css`.

To change the text domain and namespace, find and replace:

1. `'_d'` (inside single quotations) to capture the text domain
2. `_d_` to capture all the function names
3. `Text Domain: _d` in `style.css`
4. <code>&nbsp;\_d</code> (with a space before it) to capture DocBlocks
5. `_d-` to capture prefixed handles

Then update:

1. `src/scss/style.scss`
2. `theme/footer.php`
3. `theme/languages/_d.pot`

## Deploy
To deploy this stack, ensure that your host machine meets the following [requirements](#requirements) then:

- Export: `export MYSQL_USER={user}`
- Export: `export MYSQL_PASSWORD={password}`
- Run: `yarn`
- Run: `yarn deploy`

Once complete:

- Your assets will be fingerprinted (chunk hashed) and injected automatically to WordPress
- Your data will be avaliable at `${HOME}/data` and `${HOME}/wordpress`
- WordPress will be served on port `80`

## Script Commands
To use the stack's scripts, use the following commands: 

- Serve: `yarn serve` - serves the webpack static assets
- Build: `yarn build` - build the webpack static assets
- Lint: `yarn lint` - lints src's scripts and styles
- Format: `yarn format` - formats src's scripts and styles along with `package.json`
- Deploy: `yarn deploy` - builds, runs, and deploys stack to production
- Clean: `yarn clean` - removes all generated files (**Caution**: deletes data for development)

## Docker Commands
To use the stack's docker environment, use the following commands:

- Start: `yarn docker-up` - bring the docker stack up for development
- Start Prod: `yarn docker-up-prod` - brings the docker stack up for production
- Stop: `yarn docker-down` - brings the docker stack down
- Restart: `yarn docker-restart` - brings the docker stack down and up again
- Build: `yarn docker-build` - builds the docker stack for development
- Build Prod: `yarn docker-build-prod` - builds the docker stack for production
- Prune: `yarn docker-prune` - cleans all unused docker images and containers

## FAQs

1. How do I stop docker? - `yarn docker-down`
2. How do I see running docker containers? - `docker ps`
3. How do I see a container's logs? - `docker logs -f <container_name>`
4. My disk is full, what do I do? - `yarn docker-prune`
5. What is `_d`? - pronounced "underscored", `_d` is a play on the original `_s`
