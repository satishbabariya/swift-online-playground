const path = require("path");
// const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const distDir = path.resolve(__dirname, "dist/client");
// const indexPath = path.resolve(__dirname, "index.html");

const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    app: "./src/client/index.ts"
  },
  output: {
    globalObject: "self",
    filename: "[name].bundle.js",
    path: distDir
  },
  resolve: {
    extensions: [".js", ".json", ".ts", ".tsx", ".worker"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new MonacoWebpackPlugin({
      languages: ['swift'],
    }),
    new HtmlWebpackPlugin({
      title: "Swift Playground"
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
