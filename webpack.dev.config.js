const path = require('path');
const { createConfig } = require('@openedx/frontend-build');
// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');

const config = createConfig('webpack-dev', {
  resolve: {
    alias: {
      // Within this app, we can use '@src/foo instead of relative URLs like '../../../foo'
      '@src': path.resolve(__dirname, 'src/'),
      // Plugins can use 'CourseAuthoring' as an import alias for this app:
      CourseAuthoring: path.resolve(__dirname, 'src/'),
    },
    fallback: {
      fs: false,
      constants: false,
    },
  },
  // Robbo: the stock notifications tray (@edx/frontend-plugin-notifications, which the header package
  // brings along) is always replaced by the empty stub — Studio shows the Robbo bell instead
  // (src/header/robboNotificationsBell.tsx), the same one as LMS pages and the other MFEs.
  plugins: [
    new webpack.NormalModuleReplacementPlugin(
      /@edx\/frontend-plugin-notifications/,
      (resource) => {
        // eslint-disable-next-line no-param-reassign
        resource.request = path.resolve(__dirname, 'src/stubs/empty-notifications-plugin.tsx');
      },
    ),
  ],
});

module.exports = config;
