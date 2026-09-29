const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js",
    // 운영은 sj-lab.co.kr/openapi/ 하위에서 서빙되므로 상대 경로로 뽑는다.
    publicPath: "",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      // Copies the tab icon into build/ and injects <link rel="icon">
      favicon: "./public/favicon.svg",
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    port: 4100,
    open: true,
    hot: true,
    historyApiFallback: true,
    // 로컬에서는 API 호출을 게이트웨이(8100)로 넘겨준다. 같은 오리진으로 부르는 셈이라
    // CORS 설정을 따로 넣지 않아도 되고, 운영은 sj-lab.co.kr → api.sj-lab.co.kr 로
    // 게이트웨이가 이미 허용하고 있다.
    // 게이트웨이에 /open-api 라우트를 넣기 전이거나 백엔드만 따로 띄워 확인할 때는
    // OPENAPI_PROXY_TARGET=http://localhost:8110 처럼 대상 주소를 바꿔 줄 수 있다.
    proxy: {
      "/open-api": {
        target: process.env.OPENAPI_PROXY_TARGET || "http://localhost:8100",
        changeOrigin: true,
      },
    },
  },
  mode: "development",
};
