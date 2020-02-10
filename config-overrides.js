const { override, fixBabelImports, addLessLoader } = require('customize-cra');
module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: "css"
  })
);
// var webpack = require("webpack");

// module.exports = {
//   module: {
//     loaders: [
//       {
//         test: /\.jsx$/,
//         loader: 'babel',
//         query: {
//           cacheDirectory: true,
//           presets: ['react','es2015', 'stage-2']
//         }
//       }, {
//         test: /\.css$/,
//         loader: "style-loader!css-loader?root=."
//       },
//       {
//         test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
//         loader: "url?limit=10000&mimetype=application/font-woff"
//       }, {
//         test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
//         loader: "url?limit=10000&mimetype=application/font-woff"
//       }, {
//         test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
//         loader: "url?limit=10000&mimetype=application/octet-stream"
//       }, {
//         test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
//         loader: "file"
//       }, {
//         test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
//         loader: "url?limit=10000&mimetype=image/svg+xml"
//       }
//     ]
//   },
//   resolve: {
//     modulesDirectories: ['node_modules']
//   }
// };