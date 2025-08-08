const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const reactHooks = require('eslint-plugin-react-hooks');
const globals = require('globals');

module.exports = [
  {
    ignores: ['dist', '.webpack', 'out', 'coverage', 'node_modules', '*.log'],
  },
  // 基础 JS 推荐规则
  js.configs.recommended,
  // TypeScript 推荐规则（flat config 以数组形式展开）
  // 不直接全局展开 TS 推荐规则，避免作用到 JS 文件
  // TS/TSX 额外设置与规则
  {
    files: ['**/*.{ts,tsx}', '*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 2021, sourceType: 'module', ecmaFeatures: { jsx: true } },
      globals: { ...globals.node },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooks,
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  // 浏览器环境（渲染进程）
  {
    files: [
      'src/**/*.tsx',
      'src/renderer.tsx',
      'src/App.tsx',
      'src/CacheManager.tsx',
      'src/ProjectCleaner.tsx',
    ],
    languageOptions: {
      globals: { ...globals.browser },
      ecmaVersion: 2021,
      sourceType: 'module',
    },
  },
  // 测试环境（Jest）
  {
    files: ['tests/**/*.{ts,tsx,js}', '**/*.{test,spec}.{ts,tsx,js}'],
    languageOptions: { globals: { ...globals.jest, ...globals.node } },
  },
  // Node/CommonJS 环境（配置文件等）
  {
    files: [
      'webpack*.config.js',
      'webpack.*.js',
      'jest.config.js',
      'forge.config.js',
      '*.config.js',
      'eslint.config.js',
    ],
    languageOptions: { sourceType: 'commonjs', globals: { ...globals.node } },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  // 对所有 JS 文件关闭 TS 的 require 限制（若被上游启用时兜底）
  {
    files: ['**/*.{js,cjs,mjs}', '*.{js,cjs,mjs}'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
