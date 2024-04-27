// import eslint from ''
import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import prettier from 'eslint-plugin-prettier'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintConfigPrettier,
  {
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: ['.prettierrc.cjs', 'eslint.config.js', 'dist/app.js'],
  },
  {
    plugins: {
      prettier,
    },
  },
  {
    rules: {
      'prettier/prettier': 'error',
      indent: ['off'],
      'linebreak-style': 'off',
      quotes: ['error', 'single'],
      'func-names': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'padding-line-between-statements': ['error', { blankLine: 'always', prev: 'function', next: '*' }],
      'newline-before-return': 'error',
      'no-console': 'warn',
      '@typescript-eslint/ban-types': [
        'error',
        {
          types: {
            '{}': false,
            Function: false,
          },
          extendDefaults: true,
        },
      ],
      'no-prototype-builtins': 'off',
      'no-case-declarations': 'off',
    },
  }
)
