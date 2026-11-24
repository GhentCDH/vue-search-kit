import {describe, it, expect} from 'vitest';
import {createApp, h, nextTick, type Component} from 'vue';
import {createI18n} from 'vue-i18n';

import BPagination from '../src/components/Bootstrap/BPagination.vue';
import SearchToolbar from '../src/components/Search/SearchToolbar.vue';
import SelectedItemsBasket from '../src/components/Search/SelectedItemsBasket.vue';

async function render(component: Component, props: Record<string, unknown>, locale = 'fr') {
    const el = document.createElement('div');
    const app = createApp({render: () => h(component, props)});
    app.use(createI18n({legacy: false, locale, fallbackLocale: 'en', messages: {en: {}, fr: {}}}));
    app.mount(el);
    await nextTick();
    return el;
}

const tableState = {currentPage: 1, rowsPerPage: 25, orderBy: 'id', orderAsc: true};

describe('BPagination i18n', () => {
    it('spells the French "last" label correctly', async () => {
        const el = await render(BPagination, {totalRecords: 1000, page: 1, perPage: 25});
        expect(el.textContent).toContain('Dernier');
        expect(el.textContent).not.toContain('Dernièr');
    });

    it('translates the navigation aria-label', async () => {
        const el = await render(BPagination, {totalRecords: 1000, page: 1, perPage: 25});
        expect(el.querySelector('nav')?.getAttribute('aria-label')).toBe('Navigation des pages');
    });
});

describe('SearchToolbar', () => {
    it('forwards pagination labels to BPagination', async () => {
        const el = await render(SearchToolbar, {
            tableState, totalRecords: 1000, perPageValues: [25, 50], labelLast: 'Fin',
        });
        expect(el.textContent).toContain('Fin');
    });

    it('translates the default per-page label', async () => {
        const el = await render(SearchToolbar, {tableState, totalRecords: 1000, perPageValues: [25, 50]});
        expect(el.querySelector('select')?.getAttribute('aria-label')).toBe('Par page');
    });
});

describe('SelectedItemsBasket', () => {
    const baseProps = {
        selectedIds: [1, 2],
        getContextualDetailUrl: (id: number) => `/item/${id}`,
        setSelectedIds: () => {},
        removeSelectedIndex: () => {},
        saveSelectionContext: () => {},
        message: 'selectedItemsBasket.message',
    };

    it('shows a translated default view label instead of "View Charters"', async () => {
        const el = await render(SelectedItemsBasket, baseProps);
        expect(el.textContent).toContain('Voir la sélection');
        expect(el.textContent).not.toContain('View Charters');
    });

    it('uses the viewLabel prop when given', async () => {
        const el = await render(SelectedItemsBasket, {...baseProps, viewLabel: 'Voir les chartes'});
        expect(el.textContent).toContain('Voir les chartes');
    });
});
