const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const DEV_MODE = process.env.NODE_ENV === 'development';

const config = {
  root: path.resolve(__dirname),
  src: path.resolve(__dirname, 'src'),
  dist: path.resolve(__dirname, 'theme/dist'),
  nodeModules: path.resolve(__dirname, 'node_modules'),
  wordPress: 'http://localhost:3002',
};

module.exports = {
  entry: {
    index: `${config.src}/scripts/index.js`,
    home: `${config.src}/scripts/types/home.js`,
    page: `${config.src}/scripts/types/page.js`,
    post: `${config.src}/scripts/types/post.js`,
    archive: `${config.src}/scripts/types/archive.js`,
  },

  output: {
    path: `${config.dist}/js`,
    filename: DEV_MODE ? '[name].js' : '[name].[chunkhash].js',
  },

  devtool: DEV_MODE ? 'cheap-module-source-map' : 'source-map',

  devServer: {
    open: true,
    port: 3000,

    // proxy to wordpress to enable hot reloading
    proxy: {
      '/': config.wordPress,
    },

    // watch external theme files not consumed by webpack
    contentBase: `${config.root}/theme`,
    watchContentBase: true,
    watchOptions: {
      ignored: /dist/,
    },
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/](node_modules|vendor)[\\/]/,
          name: 'vendor',
          enforce: true,
          chunks: 'all',
        },
      },
    },
  },

  module: {
    rules: [
      // lint scripts
      {
        enforce: 'pre',
        test: /\.(js|mjs|jsx)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },

      // scripts
      {
        test: /\.(js|mjs|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          babelrc: true,
          cacheDirectory: true,
          cacheCompression: !DEV_MODE,
          compact: !DEV_MODE,
        },
      },

      // script externals
      {
        test: /\.(js|mjs)$/,
        exclude: /@babel(?:\/|\\{1,2})runtime/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          configFile: false,
          compact: false,
          cacheDirectory: true,
          cacheCompression: !DEV_MODE,
          sourceMaps: false,
        },
      },

      // styles
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              config: {
                path: `${config.root}/.postcssrc`,
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              includeconfig: [config.nodeModules],
              sourceMap: true,
              outputStyle: DEV_MODE ? 'expanded' : 'compressed',
            },
          },
        ],
      },

      // images
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: `images/[name].[hash:8].[ext]`,
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
              mozjpeg: {
                progressive: true,
                quality: 75,
              },
            },
          },
        ],
      },
    ],
  },

  plugins: [
    // dump webpack-dev-server memory to disk for wp
    new WriteFilePlugin(),

    new CleanWebpackPlugin([config.dist]),

    new MiniCssExtractPlugin({
      filename: DEV_MODE
        ? '../css/[name].css'
        : '../css/[name].[chunkhash].css',
      chunkFilename: '../css/[id].[chunkhash].css',
    }),

    new CopyWebpackPlugin([
      {
        from: `${config.src}/images`, // TODO clearify
        to: `${config.dist}/images`,
      },
      {
        from: `${config.root}/bin/enqueue.php`,
        to: `${config.dist}/enqueue.php`,
      },
    ]),

    new StyleLintPlugin({
      configFile: '.stylelintrc',
      context: 'src',
      files: '**/*.scss', // TODO: extend
      failOnError: false,
      quiet: false,
      syntax: 'scss',
    }),
  ],
};
