import {describe, it, expect} from 'vitest';
import {createApp, h, nextTick, ref, type Component} from 'vue';
import {createI18n} from 'vue-i18n';

import SearchHighlights from '../src/components/Search/SearchHighlights.vue';
import SearchBox from '../src/components/Search/SearchBox.vue';
import SearchToolbar from '../src/components/Search/SearchToolbar.vue';

async function render(component: Component, props: Record<string, unknown>, locale = 'en') {
    const el = document.createElement('div');
    const app = createApp({render: () => h(component, props)});
    app.use(createI18n({legacy: false, locale, fallbackLocale: 'en', messages: {en: {}, fr: {}}}));
    app.mount(el);
    await nextTick();
    return el;
}

const fields = [
    {key: 'search_text.full_text', label: 'Text'},
    {key: 'search_text.actor_names', label: 'Actors'},
];

describe('SearchHighlights', () => {
    it('renders labelled fragments in the order of fields, joined with an ellipsis', async () => {
        const el = await render(SearchHighlights, {
            fields,
            highlights: {
                'search_text.actor_names': ['<mark>Baldwin</mark> IX'],
                'search_text.full_text': ['in <mark>Gandavo</mark>', 'apud <mark>Gandavum</mark>'],
            },
        });
        const items = [...el.querySelectorAll('[data-highlight-field]')];

        expect(items.map((item) => item.getAttribute('data-highlight-field')))
            .toEqual(['search_text.full_text', 'search_text.actor_names']);
        expect(items[0].textContent).toContain('Text');
        expect(items[0].innerHTML).toContain('in <mark>Gandavo</mark> … apud <mark>Gandavum</mark>');
        expect(items[1].querySelector('mark')?.textContent).toBe('Baldwin');
    });

    it('skips fields without fragments and keys that are not listed', async () => {
        const el = await render(SearchHighlights, {
            fields,
            highlights: {'search_text.summary': ['<mark>x</mark>'], 'search_text.actor_names': []},
        });

        expect(el.querySelectorAll('[data-highlight-field]').length).toBe(0);
    });

    it('renders nothing without highlights', async () => {
        const el = await render(SearchHighlights, {fields, highlights: undefined});

        expect(el.textContent?.trim()).toBe('');
    });
});

describe('SearchBox', () => {
    async function renderBox(initial = '', locale = 'en', debounce = 0) {
        const value = ref(initial);
        const searches: string[] = [];
        const el = document.createElement('div');
        const app = createApp({
            render: () => h(SearchBox, {
                modelValue: value.value,
                'onUpdate:modelValue': (v: string) => { value.value = v; },
                onSearch: (v: string) => searches.push(v),
                debounce,
            }),
        });
        app.use(createI18n({legacy: false, locale, fallbackLocale: 'en', messages: {en: {}, fr: {}}}));
        app.mount(el);
        await nextTick();
        return {el, value, searches};
    }

    it('emits search with the typed value on Enter', async () => {
        const {el, value, searches} = await renderBox();
        const input = el.querySelector('input')!;
        input.value = 'baldwin';
        input.dispatchEvent(new Event('input'));
        input.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
        await nextTick();

        expect(value.value).toBe('baldwin');
        expect(searches).toEqual(['baldwin']);
    });

    it('searches on Enter after the typed value came back through v-model', async () => {
        const {el, searches} = await renderBox();
        const input = el.querySelector('input')!;
        input.value = 'baldwin';
        input.dispatchEvent(new Event('input'));
        await nextTick();
        input.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));

        expect(searches).toEqual(['baldwin']);
    });

    it('searches after the debounce delay', async () => {
        const {el, searches} = await renderBox('', 'en', 10);
        const input = el.querySelector('input')!;
        input.value = 'baldwin';
        input.dispatchEvent(new Event('input'));
        await nextTick();
        await new Promise((resolve) => setTimeout(resolve, 30));

        expect(searches).toEqual(['baldwin']);
    });

    it('does not search when the value is changed from outside', async () => {
        const {el, value, searches} = await renderBox('baldwin');
        value.value = '';
        await nextTick();
        el.querySelector('input')!.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));

        expect(el.querySelector('input')!.value).toBe('');
        expect(searches).toEqual([]);
    });

    it('clears the value and searches again with the clear button', async () => {
        const {el, value, searches} = await renderBox('baldwin');
        (el.querySelector('button[data-action="clear"]') as HTMLButtonElement).click();
        await nextTick();

        expect(value.value).toBe('');
        expect(searches).toEqual(['']);
    });

    it('has no clear button when empty', async () => {
        const {el} = await renderBox('');

        expect(el.querySelector('button[data-action="clear"]')).toBeNull();
    });

    it('translates its aria label', async () => {
        const {el} = await renderBox('', 'fr');

        expect(el.querySelector('input')?.getAttribute('aria-label')).toBe('Rechercher');
    });
});

describe('SearchToolbar sort options', () => {
    const tableState = {currentPage: 1, rowsPerPage: 25, orderBy: 'date_sort', orderAsc: false};
    const sortOptions = [
        {label: 'Relevance', orderBy: '_score', orderAsc: false},
        {label: 'Newest first', orderBy: 'date_sort', orderAsc: false},
        {label: 'Oldest first', orderBy: 'date_sort', orderAsc: true},
    ];

    it('shows no sort select without sort options', async () => {
        const el = await render(SearchToolbar, {tableState, totalRecords: 100, perPageValues: [25]});

        expect(el.querySelector('#sort-by')).toBeNull();
    });

    it('selects the option that matches the table state', async () => {
        const el = await render(SearchToolbar, {tableState, totalRecords: 100, perPageValues: [25], sortOptions});
        const select = el.querySelector('#sort-by') as HTMLSelectElement;

        expect([...select.options].map((o) => o.text.trim())).toEqual(['Relevance', 'Newest first', 'Oldest first']);
        expect(select.options[select.selectedIndex].text.trim()).toBe('Newest first');
    });

    it('does not pretend to apply an option when the order is none of them', async () => {
        const updates: unknown[] = [];
        const el = await render(SearchToolbar, {
            tableState: {...tableState, orderBy: 'id', orderAsc: false}, totalRecords: 100, perPageValues: [25], sortOptions,
            'onUpdate:sort': (sort: unknown) => updates.push(sort),
        });
        const select = el.querySelector('#sort-by') as HTMLSelectElement;

        expect(select.options[select.selectedIndex].text.trim()).not.toBe('Relevance');
        select.dispatchEvent(new Event('change'));
        expect(updates).toEqual([]);
        const relevance = [...select.options].findIndex((o) => o.text.trim() === 'Relevance');
        select.selectedIndex = relevance;
        select.dispatchEvent(new Event('change'));
        expect(updates).toEqual([{orderBy: '_score', orderAsc: false}]);
    });

    it('emits the chosen order as a sort update', async () => {
        const updates: unknown[] = [];
        const el = await render(SearchToolbar, {
            tableState, totalRecords: 100, perPageValues: [25], sortOptions,
            'onUpdate:sort': (sort: unknown) => updates.push(sort),
        });
        const select = el.querySelector('#sort-by') as HTMLSelectElement;
        select.selectedIndex = 2;
        select.dispatchEvent(new Event('change'));

        expect(updates).toEqual([{orderBy: 'date_sort', orderAsc: true}]);
    });
});
