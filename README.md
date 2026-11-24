# @ghentcdh/vue-search-kit

Reusable Vue 3 composables and Bootstrap 5 components for faceted search pages: filter form
(vue3-form-generator-legacy), result table, pagination, selected-items basket, search context for
prev/next navigation on detail pages, and URL/history state. `useSearchApp` wires them together.

Install from GitHub (there is no prebuilt `dist` in the repository; consumers compile `src`):

```sh
pnpm add github:GhentCDH/vue-search-kit
```

Development: `pnpm test` (vitest), `pnpm typecheck`, `pnpm build`.

## Full-text search with relevance sort and highlights

A plain search box whose results can be ordered by relevance, with highlighted snippets per result.

### Frontend

```ts
const {filterModel, onFiltersValidated, tableState, updateTableState, ...} = useSearchApp({
    // ...
    defaultTableState: {orderBy: 'date_sort', orderAsc: false, rowsPerPage: 25, currentPage: 1},
    // switch to orderBy=_score while filters.q is set, back to the default order when it is cleared
    relevanceSort: {filter: 'q'},
})
```

- Add a hidden `q` field to the filter schema (`{type: 'input', model: 'q', visible: false}`) so it
  takes part in the URL, history and filter tags like any other filter.
- `<SearchBox v-model="filterModel.q" @search="onFiltersValidated(true)" />`: input with search and
  clear buttons; searches on Enter and after a debounce (`debounce` prop, default 600 ms, 0 disables).
- `<SearchToolbar :sort-options="..." @update:sort="updateTableState" ... />`: `sortOptions` is a list
  of `{label, orderBy, orderAsc}`; the sort select is hidden when the list is empty. Offer the relevance
  option only while `q` is set.
- `<SearchHighlights :highlights="row._highlight" :fields="[{key: 'search_text.full_text', label: 'Text'}]" />`
  renders the fragments of one row, labelled, in the order of `fields`, through `v-html`.

### Backend contract

Request (the usual search query string):

| Parameter | Meaning |
|---|---|
| `filters[q]` | Plain words, no query syntax. `"..."` is a phrase, a trailing `*` a prefix. |
| `orderBy=_score` | Order by relevance (descending), with stable tiebreakers so paging is deterministic. When `filters[q]` is empty, fall back to the default order. |

Every result row adds:

| Key | Meaning |
|---|---|
| `_score` | The relevance score (optional, for display or debugging). |
| `_highlight` | Object of field key => list of fragments. Fragments **must be HTML-safe**: text escaped, only `<mark>…</mark>` as markup (Elasticsearch: highlight `encoder: html`), because they are rendered with `v-html`. |

The paginate endpoint (prev/next on detail pages) must order ids exactly like the search endpoint,
including the relevance order and its tiebreakers.

A reference implementation (Elasticsearch, `simple_query_string` over a `search_text.*` bundle of
sub-fields with per-field boosts) is in GhentCDH/DiplomataBelgica2: the `simple_query` filter type,
`buildSort`, `getSourceExcludes` and `getRelevanceTiebreakers` in
`app/src/Service/ElasticSearch/Base/AbstractSearchService.php`, and its use in `CharterSearchService.php`.
