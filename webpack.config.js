const {resolve} = require('path');
const path = require('path');
var webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

/**
 * Removes the source mapping URL specified in the minified files for node_modules.
 * @param  content 
 */
var removeSourceMapRef = function(content) {
  var lines = content.toString().split('\n');
  var x = lines.reduce((prev, current) => {
    if (current.indexOf('sourceMappingURL') < 0) {
      return prev += '\n' + current;
    } else {
      return prev;
    }
  })
  return x;
}

module.exports = {
  entry: './react/app.js',
  
	output: {
		path: resolve(__dirname, 'dist'),
		filename: 'bundle.js'
  },
  
 /*
 output: {
  filename: 'build/[name].js',
  sourceMapFilename: 'build/[name].js.map'
},*/
  mode: 'development',
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
        { from: 'img/*', to: './' },
        { from: 'js/*', to: './' },
        { from: 'node_modules/jquery/dist/jquery.slim.min.js', to :'./js'},
        { from: 'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js', to :'./js',
          transform(content, path) {
          return removeSourceMapRef(content);
        }},
      ])
    ]
  
};