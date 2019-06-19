const path = require('path');

module.exports = {
    entry: './src/App.test.jsx',
    output: {
	path: path.join(__dirname, '/static/build'),
	filename: 'app.bundle.js'
    },
    module: {
	rules: [
	    {
		test: /\.js(x)$/,
		exclude: /node_modules/,
		use: {
		    loader: "babel-loader"
		}
	    }
	]
    }
};
