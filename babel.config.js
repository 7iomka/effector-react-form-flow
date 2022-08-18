module.exports = (api) => {
  api.cache(true);

  const presets = ["next/babel", "patronum/babel-preset"];
  const plugins = [
    [
      "effector/babel-plugin",
      {
        factories: [
          "patronum",
          'effector-react-form',
          './src/shared/lib/effector-react-form',
          '@/shared/lib/effector-react-form',
          "effector-http-api",
          "effector-view"
        ],
        importName: ["effector"],
        addLoc: true,
        reactSsr: true
      }
    ]
  ];

  return {
    presets,
    plugins
  };
};
