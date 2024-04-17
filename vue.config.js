const webpack = require("webpack");
const path = require("path");
const url = require("url");
const { getModifyVars } = require("./src/ndsc-vue3/style/lib/var");
const { DOMAIN } = require("./env");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const ENV = process.env.PROXY_ENV || "dev";
const isDev = process.env.DEPLOY_ENV !== "production";

const DEFAULT_PATH = { "^/api": "/" };

module.exports = {
  publicPath: process.env.DEPLOY_ENV === "production" ? "/public/" : "/",
  productionSourceMap: !!process.env.SOURCE_MAP,
  configureWebpack: (config) => {
    config.resolveLoader = {
      modules: [
        "node_modules",
        path.resolve(__dirname, "./src/middler/webpackLoader"),
      ],
    };

    config.module.rules.push({
      include: /node_modules/,
      test: /\.mjs$/,
      type: "javascript/auto",
    });

    ENV === "dev" && (config.devtool = "source-map");

    config.resolve.alias.hooks = path.resolve(__dirname, "src/utils/hooks");
    config.resolve.symlinks = false;
    config.plugins.push(
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/)
    );
    config.plugins.push(
      new webpack.DefinePlugin({
        env: JSON.stringify(process.env.PROXY_ENV),
        DEVENV: JSON.stringify(DOMAIN[ENV]),
      })
    );

    if (process.env.NODE_ENV === "production") {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = false; // 生产环境去掉console
    }

    config.plugins.push(
      new webpack.ProvidePlugin({
        "window.Quill": "quill",
        Quill: "quill",
      })
    );

    config.plugins.push(
      ...[
        require("unplugin-auto-import/webpack")({
          include: [
            /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
            /\.vue$/,
            /\.vue\?vue/, // .vue
            /\.md$/, // .md
          ],
          imports: [
            "vue",
            "vue-router",
            "vuex",
            {
              "@vueuse/core": ["useMouse", ["useFetch", "useMyFetch"]],
              "[package-name]": ["[import-names]", ["[from]", "[alias]"]],
            },
          ],
          resolvers: [],
        }),
        new HardSourceWebpackPlugin({
          cacheDirectory: path.resolve(
            "..",
            process.cwd(),
            ".cache/hard-source/[confighash]"
          ),
          environmentHash: {
            root: process.cwd(),
            directories: [],
            files: ["package-lock.json", "yarn.lock"],
          },
          info: {
            mode: "none",
            level: "info",
          },
          cachePrune: {
            maxAge: isDev ? undefined : 2 * 24 * 60 * 60 * 1000,
            sizeThreshold: 50 * 1024 * 1024,
          },
        }),
      ]
    );
  },
  chainWebpack: (config) => {
    // htmlWebpackPlugin 配置
    config.plugin("html").tap((options) => {
      // html title: 项目名
      options[0].title = "流量分析";
      return options;
    });
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: getModifyVars(),
        javascriptEnabled: true,
      },
    },
  },
  devServer: {
    host: "127.0.0.1",
    open: true,
    proxy: {
      "/api/login": {
        target: DOMAIN[ENV],
        changeOrigin: true,
        onProxyRes(proxyRes, req) {
          const serveHost = req.headers.host;

          if (proxyRes.statusCode === 302) {
            const location = new url.URL(proxyRes.headers.location);
            if (location) {
              const KEY = "redirectUrl";

              if (!location.searchParams.has(KEY)) return;

              const redirectUrl = new url.URL(location.searchParams.get(KEY));
              redirectUrl.host = serveHost;
              location.searchParams.set(KEY, redirectUrl.toString());

              proxyRes.headers.location = location.toString();
            }
          }
        },
        pathRewrite: process.env.PROXY_ENV === "LOCAL" ? DEFAULT_PATH : {},
      },
      "/api": {
        target: DOMAIN[ENV],
        changeOrigin: true,
        pathRewrite: process.env.PROXY_ENV === "LOCAL" ? DEFAULT_PATH : {},
      },
    },
  },
  pluginOptions: {},
  lintOnSave: false,
};
