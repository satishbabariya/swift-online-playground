const path = require("path");
const distDir = path.resolve(__dirname, "dist");

module.exports = {
  mode: "development",
  entry: {
    server: "./src/server/index.ts"
  },
  output: {
    globalObject: "self",
    filename: "[name].js",
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
      }
    ]
  },
  target: "node",
  node: {
    fs: "empty",
    child_process: "empty",
    net: "empty",
    crypto: "empty"
  }
};
