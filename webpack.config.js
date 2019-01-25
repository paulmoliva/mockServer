const path = require('path');
module.exports = {
  entry: './popup.jsx',
  output: {
    path: path.resolve('./'),
    filename: './bundle.js'
  },
  // mode: 'development',
  module: {
    rules: [
      { test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      }, {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: "babel-loader"
      }
    ]
  }
}
