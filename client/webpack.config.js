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
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
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
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
          vscode: require.resolve('monaco-languageclient/lib/vscode-compatibility'),
        },
      },
      output: {
        filename: '[name].js',
        sourceMapFilename: '[file].map',
        path: path.resolve(__dirname, 'dist'),
      },
      optimization: {
        splitChunks: {
          chunks: 'all',
        },
      },
      plugins: [
        new CleanWebpackPlugin(['dist']),
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
