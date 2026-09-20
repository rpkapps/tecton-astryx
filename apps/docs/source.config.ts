import {defineConfig} from 'fumadocs-mdx/config';

/**
 * How `content/docs/**` is compiled.
 *
 * The collections themselves are declared where they are used, by the
 * `defineDocs` macro in `src/lib/source.ts`; this file is what the
 * `fumadocs-mdx` Vite plugin reads for the options that apply to all of them.
 * The defaults are what the site wants — Shiki for the fenced blocks, so the
 * source of every example is highlighted the way a consumer's editor would show
 * it, and the structured-content plugin the search index is built from.
 */
export default defineConfig();
