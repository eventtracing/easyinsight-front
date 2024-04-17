const path = require('path')
// 显示进程的完成进度
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
// 设置进度字体颜色
const chalk = require('chalk')
// 输出html
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    dark: path.resolve(__dirname, './lib/dark/index.less'),
    light: path.resolve(__dirname, './lib/light/index.less'),
    purple: path.resolve(__dirname, './lib/purple/index.less'),
    utils: path.resolve(__dirname, './lib/utils/index.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 提取js中的css文件
          'css-loader' // 将css文件整理到js文件中
        ],
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
                strictMath: false
              }
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   title: 'easy themes',
    //   filename: 'index.html',//指定生成的HTML文件名
    //   template: path.join(__dirname, './index.html') // 指定模板路径
    // }),
    new ProgressBarPlugin({
      format:
        chalk.green('Progressing') + '[:bar]' + chalk.green(':percent') + '(:elapsed seconds)',
      clear: false
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new CleanWebpackPlugin()
  ]
}
