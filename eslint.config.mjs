import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([{
    ignores: [".next/**", "node_modules/**", "docs/**"],
}, {
    extends: [...nextCoreWebVitals, ...nextTypescript],

    rules: {
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "off",
    },
}]);
