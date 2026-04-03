const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Cesium configuration
const cesiumSource = 'node_modules/cesium/Build/Cesium';
const cesiumBaseUrl = 'cesium';

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    clean: true,
    sourcePrefix: ''
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    fallback: {
      fs: false,
      path: false,
      http: false,
      https: false,
      zlib: false,
      stream: false,
      crypto: false
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: 'GMS Mock UI',
      cesiumBaseUrl: cesiumBaseUrl
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.join(cesiumSource, 'Assets'), to: path.join('cesium', 'Assets') },
        { from: path.join(cesiumSource, 'Widgets'), to: path.join('cesium', 'Widgets') },
        { from: path.join(cesiumSource, 'Workers'), to: path.join('cesium', 'Workers') }
      ]
    })
  ],
  devServer: {
    host: '0.0.0.0',
    port: 3001,
    hot: true,
    historyApiFallback: true,
    allowedHosts: 'all',
    static: {
      directory: path.join(__dirname, 'dist')
    },
    proxy: {
      '/interactive-analysis-api-gateway': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  devtool: 'source-map',
  amd: {
    toUrlUndefined: true
  }
};
