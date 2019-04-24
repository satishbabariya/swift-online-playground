var webpack = require("webpack");
var path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
	entry: {
		index: "./src/client/index.ts"
	},
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, "dist/")
	},
	resolve: {
		modules: [path.resolve(__dirname), "node_modules"],
		extensions: [".ts", ".js"]
	},
	module: {
		rules: [
			{test: /\.css$/, use: ["style-loader", "css-loader"]},
			{
				test: /\.(ts)?$/, use: {
					loader: "ts-loader"
				}
			},
			{
				test: /\.(tsx)?$/, use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env", "@babel/preset-typescript"]
					}
				}
			},
			// Font Awesome
			{test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff"},
			{test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff"},
			{test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/octet-stream"},
			{test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader"},
			{test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=image/svg+xml"}
		]
	},
	plugins: [
		new MonacoWebpackPlugin({
			languages: ['swift'],
		}),
		new HtmlWebpackPlugin({
			title: "Swift Playgroun"
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: "vendor",
			minChunks: function (module) {
				return module.context && module.context.indexOf("node_modules") !== -1;
			}
		})
	],
	devServer: {
		contentBase: path.join(__dirname, "dist"),
		port: 8080,
		open: true
	},
	resolve: {
		// Add `.ts` and `.tsx` as a resolvable extension.
		extensions: [".ts", ".tsx", ".js"]
	}
};
