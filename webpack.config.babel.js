/*
react-ssr-boilerplate
Copyright 2021-present NAVER Corp.
MIT license
 */
import path from 'path';
import { EnvironmentPlugin } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import LoadablePlugin from '@loadable/webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import SpritesmithPlugin from 'webpack-spritesmith';
import CompressionPlugin from 'compression-webpack-plugin';

const DIST_PATH = path.resolve(__dirname, 'public/dist');
const development = process.env.NODE_ENV === 'development';

const makeSprite = dirName => {
  return new SpritesmithPlugin({
    src: {
      cwd: path.resolve(__dirname, 'asset/sprites', dirName),
      glob: '*.png',
    },
    target: {
      image: path.resolve(__dirname, `public/sprite/${dirName}-[hash].png`),
      css: [
        [
          path.resolve(__dirname, `public/sprite/${dirName}.scss`),
          {
            format: 'handlebars_based_template',
            formatOpts: { ratio: 2 },
          },
        ],
      ],
    },
    apiOptions: {
      generateSpriteName: function (fileName) {
        const parsed = path.parse(fileName);
        const dir = parsed.dir.split(path.sep);
        const moduleName = dir[dir.length - 1];
        return moduleName + '__' + parsed.name;
      },
      cssImageRef: path.resolve(
        __dirname,
        `public/sprite/${dirName}-[hash].png`,
      ),
    },
    customTemplates: {
      handlebars_based_template: path.resolve(
        __dirname,
        'asset/sprites/scss.template.handlebars',
      ),
    },
  });
};

const spritePlugins = ['main', 'modal', 'list', 'searchBox'].map(dir =>
  makeSprite(dir),
);

const getConfig = target => ({
  name: target,
  mode: 'none',
  target: [target, 'es5'],
  entry: `./src/client/main-${target}.js`,
  module: {
    rules: [
      {
        test: /\.([jt])sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            caller: { target },
          },
        },
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
      {
        test: /\.(sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
        type: 'javascript/auto',
      },
    ],
  },
  externals:
    target === 'node'
      ? [
          '@loadable/component',
          nodeExternals(),
        ]
      : undefined,

  optimization: {
    runtimeChunk: target !== 'node',
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css'],
  },

  output: {
    path: path.join(DIST_PATH, target),
    filename: development ? '[name].js' : '[name]-bundle-[chunkhash:8].js',
    publicPath: `/dist/${target}/`,
    libraryTarget: target === 'node' ? 'commonjs2' : undefined,
  },
  plugins: [
    new LoadablePlugin(),
    new MiniCssExtractPlugin({
      filename: development ? '[name].css' : '[name]-[chunkhash:8].css',
      chunkFilename: development ? '[id].css' : '[id]-[chunkhash:8].css',
    }),
    new CaseSensitivePathsPlugin(),
    new CompressionPlugin(),
    new CleanWebpackPlugin(),
    new EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
    ...spritePlugins,
  ],
});

export default [getConfig('web'), getConfig('node')];
