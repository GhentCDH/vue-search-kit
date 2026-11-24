import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {createApp, h, nextTick} from 'vue';
import {createI18n} from 'vue-i18n';

import {useSearchApp} from '../src/composables/useSearchApp';

type App = ReturnType<typeof useSearchApp>;

const requestedUrls: string[] = [];

/** Mount useSearchApp inside a component (it registers lifecycle hooks). */
function mountSearchApp(withRelevance = true): App {
    let searchApp: App | undefined;
    const app = createApp({
        setup() {
            searchApp = useSearchApp({
                searchApiUrl: 'http://test.com/search',
                detailUrl: (id) => `/detail/${id}`,
                defaultTableState: {orderBy: 'date_sort', orderAsc: false, rowsPerPage: 25, currentPage: 1},
                autoInit: false,
                ...(withRelevance ? {relevanceSort: {filter: 'q'}} : {}),
            });
            return () => h('div');
        },
    });
    app.use(createI18n({legacy: false, locale: 'en', messages: {en: {}}}));
    app.mount(document.createElement('div'));
    return searchApp!;
}

const lastQuery = () => new URL(requestedUrls[requestedUrls.length - 1]).searchParams;

describe('useSearchApp relevanceSort', () => {
    beforeEach(() => {
        requestedUrls.length = 0;
        vi.stubGlobal('fetch', vi.fn(async (url: string) => {
            requestedUrls.push(String(url));
            return new Response(JSON.stringify({count: 0, data: []}), {
                headers: {'Content-Type': 'application/json'},
            });
        }));
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('sorts by relevance when the relevance filter gets a value', async () => {
        const app = mountSearchApp();
        await app.updateFilterState({q: 'baldwin'});

        expect(app.tableState.value.orderBy).toBe('_score');
        expect(app.tableState.value.orderAsc).toBe(false);
        expect(lastQuery().get('orderBy')).toBe('_score');
    });

    it('restores the default order when the relevance filter is cleared', async () => {
        const app = mountSearchApp();
        await app.updateFilterState({q: 'baldwin'});
        expect(app.tableState.value.orderBy).toBe('_score');
        await app.updateFilterState({});

        expect(app.tableState.value.orderBy).toBe('date_sort');
        expect(app.tableState.value.orderAsc).toBe(false);
        expect(lastQuery().get('orderBy')).toBe('date_sort');
    });

    it('keeps a sort the user picked while the filter stays set', async () => {
        const app = mountSearchApp();
        await app.updateFilterState({q: 'baldwin'});
        await app.updateTableState({orderBy: 'id', orderAsc: true});
        await app.updateFilterState({q: 'baldwin ghent'});

        expect(app.tableState.value.orderBy).toBe('id');
        expect(app.tableState.value.orderAsc).toBe(true);
    });

    it('keeps a sort the user picked when the filter is cleared', async () => {
        const app = mountSearchApp();
        await app.updateFilterState({q: 'baldwin'});
        expect(app.tableState.value.orderBy).toBe('_score');
        await app.updateTableState({orderBy: 'id', orderAsc: true});
        await app.updateFilterState({});

        expect(app.tableState.value.orderBy).toBe('id');
    });

    it('treats a blank value as empty', async () => {
        const app = mountSearchApp();
        await app.updateFilterState({q: '   '});

        expect(app.tableState.value.orderBy).toBe('date_sort');
    });

    it('leaves the order alone without a relevanceSort config', async () => {
        const app = mountSearchApp(false);
        await app.updateFilterState({q: 'baldwin'});
        await nextTick();

        expect(app.tableState.value.orderBy).toBe('date_sort');
    });
});
