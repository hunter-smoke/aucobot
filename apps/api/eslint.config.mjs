import eslint from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";

const featureRoots = [
  "tools",
  "integrations",
  "channels",
  "workflow",
  "ai-orchestration",
];

/** Cross-feature imports are forbidden (manifest barrel is exempt). */
function featureCrossImportZones() {
  const zones = [];

  for (const target of featureRoots) {
    for (const from of featureRoots) {
      if (target === from) {
        continue;
      }

      zones.push({
        target: `./src/features/${target}`,
        from: `./src/features/${from}`,
        message:
          "Features must not import each other directly — use core/events or @aucobot/shared.",
      });
    }
  }

  return zones;
}

const coreSafetyRules = {
  eqeqeq: ["error", "always", { null: "ignore" }],
  "no-eval": "error",
  "no-implied-eval": "error",
  "no-new-func": "error",
  "no-script-url": "error",
  "no-throw-literal": "error",
  "prefer-promise-reject-errors": "error",
  "array-callback-return": "error",
  "no-promise-executor-return": "error",
  "no-return-assign": "error",
  "no-self-assign": "error",
  "no-unreachable-loop": "error",
  "no-unsafe-optional-chaining": "error",
  "no-console": "error",
  "no-param-reassign": [
    "error",
    {
      props: true,
      ignorePropertyModificationsFor: ["acc", "draft", "state"],
    },
  ],
  "consistent-return": "error",
  "default-case": "error",
  "default-case-last": "error",
  "prefer-template": "error",
  "guard-for-in": "error",
};

const importRules = {
  "import/no-duplicates": "error",
  "import/no-self-import": "error",
  "import/no-useless-path-segments": "error",
  "import/first": "error",
  "import/newline-after-import": "error",
  "import/order": [
    "error",
    {
      groups: ["builtin", "external", "internal", "parent", "sibling", "index", "type"],
      pathGroups: [{ pattern: "@aucobot/**", group: "internal", position: "before" }],
      pathGroupsExcludedImportTypes: ["type"],
      alphabetize: { order: "asc", caseInsensitive: true },
      "newlines-between": "always",
    },
  ],
};

const typescriptErrorRules = {
  "@typescript-eslint/no-explicit-any": "error",
  "@typescript-eslint/ban-ts-comment": [
    "error",
    {
      "ts-expect-error": "allow-with-description",
      "ts-ignore": true,
      "ts-nocheck": true,
    },
  ],
  "@typescript-eslint/consistent-type-imports": [
    "error",
    { prefer: "type-imports", fixStyle: "separate-type-imports" },
  ],
  "@typescript-eslint/no-floating-promises": "error",
  "@typescript-eslint/no-misused-promises": [
    "error",
    {
      checksVoidReturn: { attributes: false },
    },
  ],
  "@typescript-eslint/no-unsafe-argument": "error",
  "@typescript-eslint/no-unsafe-return": "error",
  "@typescript-eslint/no-unsafe-call": "error",
  "@typescript-eslint/no-unsafe-assignment": "error",
  "@typescript-eslint/no-unsafe-member-access": "error",
  "@typescript-eslint/require-await": "error",
  "@typescript-eslint/no-base-to-string": "error",
  "@typescript-eslint/no-require-imports": "error",
  "@typescript-eslint/restrict-template-expressions": "error",
};

export default tseslint.config(
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  prettierRecommended,
  {
    files: ["**/*.ts"],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      ...coreSafetyRules,
      ...importRules,
      ...typescriptErrorRules,
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@nestjs/platform-fastify",
              message: "Use @nestjs/platform-express (Express).",
            },
          ],
        },
      ],
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./src/core",
              from: "./src/features",
              message:
                "core/ must not import features/ — use core/plugins contracts (planned).",
            },
            ...featureCrossImportZones(),
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.controller.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@nestjs/platform-fastify",
              message: "Use @nestjs/platform-express (Express).",
            },
            {
              name: "@aucobot/database",
              message: "Controllers delegate to services — do not import database.",
            },
          ],
          patterns: [
            {
              group: ["**/database/prisma.service", "**/prisma.service"],
              message: "Controllers delegate to services — do not use PrismaService.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["**/dto/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@nestjs/common",
              importNames: ["Injectable"],
              message: "DTO files are validation-only — no @Injectable.",
            },
            {
              name: "@aucobot/database",
              message: "DTO files must not import database.",
            },
          ],
          patterns: [
            {
              group: ["**/database/prisma.service", "**/prisma.service"],
              message: "DTO files must not import PrismaService.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.middleware.ts"],
    rules: {
      "no-param-reassign": ["error", { props: false }],
    },
  },
  {
    files: ["**/logging.service.ts"],
    rules: {
      "no-console": "off",
    },
  },
  {
    files: ["**/*.spec.ts", "**/*.test.ts"],
    rules: {
      "no-console": "off",
    },
  },
  {
    files: ["eslint.config.mjs"],
    rules: {
      "no-console": "off",
      "import/order": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
);
