import * as webpack from "webpack";
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

const clientConfig: webpack.Configuration = {
    entry: {
        index: './src/client/index.ts'
      },
      output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist/')
      },
      resolve: {
        modules: [path.resolve(__dirname), 'node_modules'],
        extensions: ['.ts', '.js']
      },
      module: {
        rules: [
          { test: /\.css$/, use: ['style-loader', 'css-loader'] },
          { test: /\.ts$/, use: ['ts-loader', 'tslint-loader']},
        ]
      },
      plugins: [
        new HtmlWebpackPlugin({
          title: "Swift Playground"
        }),
        new MonacoWebpackPlugin({
          languages: ['swift']
        })
      ],
      target: "web",
      node: {
        fs: "empty",
        child_process: "empty",
        net: "empty",
        crypto: "empty"
      }
};

// const serverConfig: webpack.Configuration = {
//     entry: {
//         index: './src/server/index.ts'
//       },
//       output: {
//         filename: '[name].js',
//         path: path.resolve(__dirname, 'dist/')
//       },
//       resolve: {
//         modules: [path.resolve(__dirname), 'node_modules'],
//         extensions: ['.ts', '.js']
//       },
//       module: {
//         rules: [
//           { test: /\.ts$/, use: ['ts-loader', 'tslint-loader']},
//         ]
//       },
//       target: "node",
//       node: {
//         fs: "empty",
//         child_process: "empty",
//         net: "empty",
//         crypto: "empty"
//       }
// };

export default [clientConfig];