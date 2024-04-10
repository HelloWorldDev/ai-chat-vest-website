const { defineConfig } = require("@vue/cli-service");
const { VantResolver } = require("unplugin-vue-components/resolvers");
const ComponentsPlugin = require("unplugin-vue-components/webpack");
const path = require("path");
function resolve(dir) {
    return path.join(__dirname, ".", dir);
}

module.exports = defineConfig({
    productionSourceMap: false,
    transpileDependencies: true,
    publicPath: process.env.VUE_APP_CDN_HREF,
    devServer: {
        open: true,
        host: "localhost",
        port: "8061",
        https: false,
    },
    configureWebpack: {
        plugins: [
            ComponentsPlugin({
                resolvers: [VantResolver()],
            }),
            require("unplugin-element-plus/webpack")({
                // options
            }),
        ],
    },
    chainWebpack(config) {
        config.optimization.minimizer("terser").tap((args) => {
            // 注释console.*
            args[0].parallel = 4;
            args[0].terserOptions.compress.warnings = true;
            args[0].terserOptions.compress.drop_debugger = true;
            args[0].terserOptions.compress.drop_console = true;
            return args;
        });
        // 避免i18n发出警告，直接指定位置
        config.resolve.alias.set(
            "vue-i18n",
            process.env.NODE_ENV === "production" ? "vue-i18n/dist/vue-i18n.cjs.prod.js" : "vue-i18n/dist/vue-i18n.cjs.js"
        );
        // svg
        config.module.rule("svg").exclude.add(resolve("src/icons")).end();
        config.module
            .rule("icons")
            .test(/\.svg$/)
            .include.add(resolve("src/icons"))
            .end()
            .use("svg-sprite-loader")
            .loader("svg-sprite-loader")
            .options({
                symbolId: "icon-[name]",
            })
            .end();
    },
});
