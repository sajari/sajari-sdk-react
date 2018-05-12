import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import babel from "rollup-plugin-babel";
import pkg from "./package.json";

const input = "src/index.ts";

const external = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies)
];

const plugins = [
  resolve(),
  commonjs(),
  typescript(),
  babel({
    exclude: "node_modules/**" // only transpile our source code
  })
];

export default [
  {
    input,
    output: {
      name: "SajariReactSDK",
      file: pkg.browser,
      format: "umd"
    },
    plugins
  },
  {
    input,
    external,
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" }
    ],
    plugins
  }
];