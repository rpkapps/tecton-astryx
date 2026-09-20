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
      'apps/docs/content/**',
      'apps/docs/.next/**',
      'apps/docs/.source/**',
      'apps/docs/out/**',
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
  {
    // This one drives a browser from Node: the function bodies it hands to
    // `page.evaluate()` are serialised and run in the page, so `document`,
    // `window` and friends are in scope for half the file.
    files: ['scripts/verify-registry.mjs'],
    languageOptions: {
      globals: {...globals.node, ...globals.browser},
    },
  },
);
