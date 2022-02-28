// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

// eslint-disable-next-line func-names
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            assets: path.resolve(__dirname, 'src/assets'),
            components: path.resolve(__dirname, 'src/components'),
            constants: path.resolve(__dirname, 'src/constants'),
            hooks: path.resolve(__dirname, 'src/hooks'),
            i18n: path.resolve(__dirname, 'src/i18n'),
            providers: path.resolve(__dirname, 'src/providers'),
            routes: path.resolve(__dirname, 'src/routes'),
            screens: path.resolve(__dirname, 'src/screens'),
            styles: path.resolve(__dirname, 'src/styles'),
            types: path.resolve(__dirname, 'src/types'),
            utils: path.resolve(__dirname, 'src/utils'),
          },
          extensions: ['.ts', '.tsx'],
        },
      ],
      ['react-native-reanimated/plugin'],
    ],
  };
};
