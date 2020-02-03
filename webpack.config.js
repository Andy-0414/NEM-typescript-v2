const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
	entry: "./src/app.ts",
	mode: "production", // development
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/
			}
		]
	},
	devtool: "source-map",
	target: "node",
	externals: [nodeExternals()],
	resolve: {
		extensions: [".tsx", ".ts", ".js"]
	},
	output: {
		filename: "app.js",
		path: path.resolve(__dirname, "dist")
	},
	node: {
		__dirname: false
	}
};
