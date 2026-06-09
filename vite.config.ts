import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import cssInjectedByJs from 'vite-plugin-css-injected-by-js';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';

// External packages that must NOT be bundled into the library output.
// Consumers (or their installs) provide these.
const external = [
    'vue',
    'vue-i18n',
    '@vueuse/core',
    'vue3-form-generator-legacy',
    'qs',
    'articles',
    'wnumb',
    'lodash.merge',
    'axios',
];

export default defineConfig({
    plugins: [
        vue(),
        VueI18nPlugin({}),
        // Inline the (tiny) extracted CSS into the JS bundle so dist consumers
        // get component styles automatically — no separate style.css import.
        cssInjectedByJs(),
        dts({
            tsconfigPath: './tsconfig.build.json',
        }),
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            formats: ['es'],
            fileName: 'index',
            cssFileName: 'style',
        },
        rollupOptions: {
            external: (id) =>
                external.includes(id) || external.some((dep) => id.startsWith(`${dep}/`)),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
    },
});
