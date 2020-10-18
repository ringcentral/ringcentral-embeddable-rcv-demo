require('dotenv').config()
const webpack = require('webpack')
const { identity } = require('lodash')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const express = require('express')
const path = require('path')
const pack = require('./package.json')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { env } = process
const devPort = env.devPort || 5070
const host = env.host || 'localhost'

const version = pack.version
const isProd = env.NODE_ENV === 'production'
const extractTextPlugin1 = new MiniCssExtractPlugin({
  filename: 'css/[name].styles.css'
})
const pug = {
  loader: 'pug-html-loader',
  options: {
    data: {
      version,
      cdn: '',
      _global: {
        cdn: '',
        version
      }
    }
  }
}
const stylusSettingPlugin = new webpack.LoaderOptionsPlugin({
  test: /\.styl$/,
  stylus: {
    preferPathResolver: 'webpack'
  },
  'resolve url': false
})

var config = {
  watch: true,
  mode: 'development',
  entry: {
    rc: './src/client/rc.jsx',
    index: './src/server/views/index.pug'
  },
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: 'js/[name]' + '.bundle.js',
    publicPath: '/',
    chunkFilename: 'js/[name]' + '.bundle.js',
    libraryTarget: 'var'
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.json']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader?cacheDirectory']
      },
      {
        test: /\.styl$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: '../'
            }
          },
          'css-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: '../'
            }
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|svg)$/,
        use: ['url-loader?limit=1&name=images/[name].[ext]']
      },
      {
        test: /\.pug$/,
        use: [
          'file-loader?name=index.html',
          'concat-loader',
          'extract-loader',
          'html-loader',
          pug
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  devtool: '#eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    stylusSettingPlugin,
    extractTextPlugin1
  ].filter(identity),
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    },
    contentBase: path.join(__dirname, 'docs/'),
    historyApiFallback: true,
    hot: true,
    inline: true,
    host,
    port: devPort,
    proxy: {
      '/': {
        target: `http://${env.RINGCENTRAL_HOST}:${env.RINGCENTRAL_PORT}`,
        bypass: function (req, res, proxyOptions) {
          if (req.path.includes('.bundle.')) {
            return req.path
          }
        }
      }
    },
    before: (app) => {
      app.use('/node_modules', express.static(
        path.resolve(__dirname, './node_modules'), { maxAge: '170d' })
      )
    }
  }
}

if (isProd) {
  config.plugins = [
    extractTextPlugin1,
    stylusSettingPlugin
  ]
  config.optimization = {
    minimize: true
  }
  config.mode = 'production'
  delete config.watch
  delete config.devtool
  delete config.devServer
}

module.exports = config
