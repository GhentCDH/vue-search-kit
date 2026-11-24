import {describe, it, expect, vi} from 'vitest';
import {createApp, h, nextTick, type Component} from 'vue';
import {createI18n} from 'vue-i18n';

import BPagination from '../src/components/Bootstrap/BPagination.vue';
import SearchToolbar from '../src/components/Search/SearchToolbar.vue';
import SelectedItemsBasket from '../src/components/Search/SelectedItemsBasket.vue';

async function render(component: Component, props: Record<string, unknown>, locale = 'fr', messages = {en: {}, fr: {}}) {
    const el = document.createElement('div');
    const app = createApp({render: () => h(component, props)});
    app.use(createI18n({legacy: false, locale, fallbackLocale: 'en', messages}));
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

    it('shows the translated default message without a message prop', async () => {
        const el = await render(SelectedItemsBasket, baseProps);
        expect(el.textContent).toContain('2 éléments sélectionnés');
    });

    it('translates an app message key in the global scope without warnings', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const messages = {
            en: {app: {selected: 'No charters selected | {count} charter selected | {count} charters selected'}},
            fr: {app: {selected: 'Aucune charte sélectionnée | {count} charte sélectionnée | {count} chartes sélectionnées'}},
        };
        const el = await render(SelectedItemsBasket, {...baseProps, message: 'app.selected'}, 'fr', messages);
        expect(el.textContent).toContain('2 chartes sélectionnées');
        expect(warn).not.toHaveBeenCalled();
        warn.mockRestore();
    });
});
