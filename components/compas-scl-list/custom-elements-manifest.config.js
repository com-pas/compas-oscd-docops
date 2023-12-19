import { readmePlugin } from "cem-plugin-readme";

export default {
  globs: ["src/*.ts"],
  exclude: ["test/*.ts", "stories/*.ts"],
  litelement: true,
  plugins: [
    readmePlugin({
      to: "components/compas-scl-list/README.md",
    }),
  ],
};
