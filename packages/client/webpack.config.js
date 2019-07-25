const path = require('path');
const webpack = require('webpack');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const webpackMerge = require('webpack-merge');

const modeConfig = env => require(`./webpack.${env}`)(env);

module.exports = ({ mode, presets } = { mode: 'production', presets: [] }) => {
  return webpackMerge(
    {
      entry: {
        main: './src/index.ts',
        'editor.worker': 'monaco-editor-core/esm/vs/editor/editor.worker.js',
      },
      mode,
      devtool: 'source-map',
      module: {
        rules: [
          {
            test: /\.js$/,
            use: ['source-map-loader'],
            enforce: 'pre',
          },
          {
            test: /\.ts?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
          {
            test: /\.(tsx)?$/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-typescript'],
              },
            },
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },
          {
            test: /\.(png|jpg|bmp)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  emitFile: true,
                },
              },
            ],
          },
        ],
      },
      resolve: {
        extensions: ['.tsx', '.ts', '.js', 'jsx'],
        alias: {
          vscode: require.resolve('monaco-languageclient/lib/vscode-compatibility'),
        },
      },
      output: {
        filename: '[name].bundle.js',
        sourceMapFilename: '[file].map',
        path: path.resolve(__dirname, '../../dist/public'),
      },
//       optimization: {
//         splitChunks: {
//           chunks: 'all',
//         },
//       },
      plugins: [
        new CleanWebpackPlugin(['../dist/public']),
        new HtmlWebPackPlugin({
          title: 'Swift Playground',
        }),
      ],
      target: 'web',
      node: {
        fs: 'empty',
        child_process: 'empty',
        net: 'empty',
        crypto: 'empty',
      },
    },
    modeConfig(mode)
  );
};
