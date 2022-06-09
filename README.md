## Starting the dev server

Make sure you have **Node.js** installed.

1. Run `npm install`
2. Start the dev server using `npm run startwithauth`
3. Open [http://localhost:3000](http://localhost:3000)

## Starting the QA server

Make sure you have **Node.js** installed.

1. Run `npm install`
2. Start the QA server using `npm run qastartwithauth`
3. Open [http://localhost:3000](http://localhost:3000)

## Available Commands

- `npm run startwithauth` - start the dev server
- `npm run qastartwithauth` - start the dev server
- `npm clean` - delete the dist folder
- `npm run devwithauth` - create a production ready build for DEV in `dist` folder
- `npm run qawithauth` - create a production ready build for QA in `dist` folder
- `npm run lint` - execute an eslint check
- `npm run deploy` - stop the forever server, execute a git pull and start the forever server again on the targeted server

## Breaking down the Commands

- `npm start`
  - Script: `"webpack-dev-server --mode development --progress --colors --open --hot --port 3000"`
  - Script breakdown:
    - `webpack-dev-server`: Runs webpack.config.js, creates the build and host the files on webpack development server.
    - `--mode development`: Sets the webpack build mode to development.
    - `--progress --colors`: Shows the progress of the build on the console with different colors for different assets.
    - `--open`: Opens the default system browser.
    - `--hot`: Activates the hot reload functionality where the browser itself reloads the component whenever the developer make any changes in the corresponding code.
    - `--port 3000`: Targets the dev server and serve the distributable files on port 3000.
    - Please note that `npm run clean` runs as before `npm start` which deletes the pre-existing dist folder from the project file system.
- `npm run build`

  - Script: `"npm run clean && webpack --mode production --progress --colors"`
  - Script breakdown:
    - `npm run clean`: Deletes the pre-existing dist folder from the project file system.
    - `webpack`: Runs webpack.config.js and creates the build.
    - `--mode production`: Sets the webpack build mode to production.
    - `--progress --colors`: Shows the progress of the build with different colors for different assets on the console.

- `npm run lint`
  - Script: `"eslint --fix src"`
  - Runs eslint and checks for any linting errors in the src folder.
  - `--fix` flag fixes the linting errors whch can be auto fixed by eslint script.
  - Please note, for this command you need eslint to be installed globally on your machine. To install, please run `npm install eslint -g`.

## Webpack upgraded from v.2.5.1 to v4.6.0

- Webpack 4 now guarantees you up to a 98% decrease in build time.
- Take advantage of the modern ES6 syntax which results in a more cleaner and stable code.
- Webpack 4 ships with a property called `mode` which allows you to easily set which environment you're working on, `development` and `production`. Each option has it's own advantages and usage.
- Setting the `mode` to `development` allows you to focus on building by giving you the best development experience with features like:
  - Tooling for browser debugging.
  - Comments, detailed error messages and hints for development are enabled.
  - Fast and optimized incremental rebuilds.
- While setting `mode` to `production` offers you the best option and defaults needed for deploying your project such as:
  - Optimizations to generate optimized bundles.
  - Smaller output size.
  - Exclusion of development-only code.
- `javascript/auto` used to be the default module in webpack 3 but webpack 4 completely abstracted the JavaScript specificity from the code base to allow for this change so that users can specify the kind of module they want.

- **Plugins and Optimizations:**

  - The `CommonsChunkPlugin` was removed in webpack 4 and has been replaced with a set of defaults and API called `optimization.splitChunks` and `optimization.runtimeChunk`. This means you now get to have shared chunks automatically generated for you.
  - `NoEmitOnErrorsPlugin` was deprecated and is now optimization.noEmitOnErrors. It's set to on by default in production mode.
  - `ModuleConcatenationPlugin` was deprecated and is now `optimization.concatenateModules`. It's set to on by default in production mode.
  - `NamedModulesPlugin` was deprecated and is now `optimization.namedModules`. It's set to on by default in production mode.

- **Other updates:**

  - Improve stats output alignment.
  - Improve stats text output when all exports are used.
  - Add `prefetched/preloaded` chunks and assets to stats text output.
  - `UglifyJs` now caches and parallizes by default.
  - Performance improvement for `RemoveParentModulesPlugin`.
  - Script tags are no longer `text/javascript` and async as this are the default values (saves a few bytes).
  - Persistent Caching.

- You can check out the full release log for webpack 4 [here](https://github.com/webpack/webpack/releases).
