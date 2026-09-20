import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      // Agent worktrees are whole checkouts of this repository living inside
      // it (they are in .gitignore, and Prettier skips them already because
      // the directory is a dotfile). Linting another checkout's work in
      // progress from here fails `pnpm check` for reasons that have nothing
      // to do with this tree.
      '.claude/**',
      'apps/docs/src/generated/**',
      'design/**',
      'tokens/**',
      'screenshots/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: {...globals.browser, ...globals.node},
    },
    plugins: {'react-hooks': reactHooks},
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {argsIgnorePattern: '^_', varsIgnorePattern: '^_'},
      ],
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {...globals.node},
    },
  },
);
