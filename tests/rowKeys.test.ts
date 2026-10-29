import {describe, it, expect} from 'vitest';
import {createApp, h, nextTick, ref} from 'vue';
import {createI18n} from 'vue-i18n';

import SearchResultTable from '../src/components/Search/SearchResultTable.vue';

describe('SearchResultTable row keys', () => {
    it('keys rows by idKey, so rows sharing a numeric id are distinct', async () => {
        const warnings: string[] = [];
        const el = document.createElement('div');
        const items = ref([
            {id: 2, key: 'copy:2', type: 'copy 2'},
            {id: 9, key: 'copy:9', type: 'copy 9'},
        ]);
        const app = createApp({
            render: () => h(SearchResultTable, {items: items.value, fields: [{key: 'type', label: 'Type'}], selectedIds: [], idKey: 'key'}),
        });
        app.config.warnHandler = (msg) => warnings.push(msg);
        app.use(createI18n({legacy: false, locale: 'en', messages: {en: {}}}));
        app.mount(el);
        await nextTick();
        // a new page/sort re-renders the rows (keyed diff)
        items.value = [
            {id: 3, key: 'copy:3', type: 'copy 3'},
            {id: 1, key: 'copy:1', type: 'copy 1'},
            {id: 1, key: 'original:1', type: 'original 1'},
            {id: 4, key: 'copy:4', type: 'copy 4'},
        ];
        await nextTick();

        expect(warnings.filter((msg) => msg.includes('Duplicate keys'))).toEqual([]);
        expect([...el.querySelectorAll('tbody tr')].map((tr) => tr.textContent?.trim())).toEqual(['copy 3', 'copy 1', 'original 1', 'copy 4']);
    });
});
