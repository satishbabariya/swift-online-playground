import * as webpack from "webpack";
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");


const clientConfig: webpack.Configuration = {
  entry: {
    app: "./src/client/index.ts"
  },
  output: {
    path: path.resolve(__dirname, 'dist/client'),
    // publicPath: '/dist/public',
    filename: '[name].bundle.js',
    chunkFilename: '[id].[hash].chunk.js',
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  devtool: "cheap-module-source-map",
  module: {
    rules: [
      // {
      //   test: /\.css$/,
      //   use: "css-loader",
      // },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "awesome-typescript-loader",
      },
    ],
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

const serverConfig: webpack.Configuration = {
  entry: {
    server: "./src/server/index.ts",
  },
  target: "node",
  output: {
    path: path.resolve(__dirname, 'dist/server'),
    // publicPath: '/dist/public',
    filename: '[name].js',
    chunkFilename: '[id].[hash].chunk.js',
    libraryTarget: "commonjs2",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  devtool: "cheap-module-source-map",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: "css-loader/locals",
          },
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: /(node_modules)/,
        loader: "awesome-typescript-loader",
      },
    ],
  },
};

export default [clientConfig, serverConfig];
