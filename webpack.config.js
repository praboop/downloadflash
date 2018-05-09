const {resolve} = require('path');
const path = require('path');
var webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './react/app.js',
	output: {
		path: resolve(__dirname, 'dist'),
		filename: 'bundle.js'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: '.',
    host: '0.0.0.0',
    port: 8080,
    disableHostCheck: true
  },
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
        use: ['babel-loader']
			},
      { 
        test: /\.css$/, 
        use: ['style-loader', 'css-loader']
      },
      { 
        test: /\.(png|jpg)$/,
        use: 'file-loader?name=img/[name].[ext]'
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        use: 'file-loader?name=fonts/[name].[ext]'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader?name=icons/[name].[ext]'
      }
    ]
  },
  plugins: 
    [
      new CopyWebpackPlugin([
        { from: 'manifest.json', to: './' },
        { from: 'icons/*', to: './' },
        { from: 'js/*', to: './' }
      ])
    ]
  
};