module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
  ],
  plugins: [
    ['babel-plugin-react-scoped-css', { include: '.scoped.styl$' }],
  ],
};
