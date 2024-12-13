const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  compress: true,
  reactStrictMode: false,
  images: {
    dangerouslyAllowSVG: true,
    domains: [
      "yehaww-bucket.s3.amazonaws.com",
      "purecatamphetamine.github.io",
      "yehaww-bucket.s3.us-east-2.amazonaws.com",
      "i.pinimg.com",
      "yehaww-prod.s3.amazonaws.com",
      "media2.globalequestriangroup.com",
      "yehaww-prod.s3.us-east-2.amazonaws.com",
      "test.mrizwan.website",
      "secure.gravatar.com",
      "content.yehaww.com",
      "blog.yehaww.com",
      "lh3.googleusercontent.com",
    ],
  },
});

// const withCSS = require("@zeit/next-css");
// const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

// module.exports = withCSS({
//   webpack(config, options) {
//     config.optimization.minimizer = [];
//     config.optimization.minimizer.push(new OptimizeCSSAssetsPlugin({}));

//     return config;
//   },
// });
