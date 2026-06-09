/// <reference types="vite/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

// Untyped runtime dependencies (mirrors the host app's ambient declarations).
declare module 'articles';
declare module 'qs';
declare module 'lodash.merge';
declare module 'wnumb';
declare module 'vue3-form-generator-legacy';
