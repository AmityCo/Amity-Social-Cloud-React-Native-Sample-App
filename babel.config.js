const path = require("path");

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin",
      [
        "module-resolver",
        {
          alias: {
            assets: path.resolve(__dirname, "src/assets"),
            components: path.resolve(__dirname, "src/components"),
            constants: path.resolve(__dirname, "src/constants"),
            context: path.resolve(__dirname, "src/context"),
            hooks: path.resolve(__dirname, "src/hooks"),
            i18n: path.resolve(__dirname, "src/i18n"),
            routes: path.resolve(__dirname, "src/routes"),
            screens: path.resolve(__dirname, "src/screens"),
            styles: path.resolve(__dirname, "src/styles"),
            types: path.resolve(__dirname, "src/types"),
            utils: path.resolve(__dirname, "src/utils"),
          },
        },
      ],
    ],
  };
};
