const DEV_DOMAIN = {
  // 开发环境域名
  intern: "",
  // 测试环境域名
  test: "",
};

const ENV_HOST = {
  DEV: (env) => DEV_DOMAIN[env],
  // 线上真实域名地址
  ONLINE: () => "",
};

module.exports = {
  ENV_HOST,
  DEV_DOMAIN,
};
