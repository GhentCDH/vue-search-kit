// Public API for @ghentcdh/vue-faceted-search

// --- Components ---
export { default as BDropdown } from './components/Bootstrap/BDropdown.vue';
export { default as BFilterTags } from './components/Bootstrap/BFilterTags.vue';
export { default as BLink } from './components/Bootstrap/BLink.vue';
export { default as BPagination } from './components/Bootstrap/BPagination.vue';
export { default as BRadioList } from './components/Bootstrap/BRadioList.vue';
export type { RadioItem } from './components/Bootstrap/BRadioList.vue';
export { default as BSelect } from './components/Bootstrap/BSelect.vue';
export { default as BTable } from './components/Bootstrap/BTable.vue';
export { default as RecordCount } from './components/Bootstrap/RecordCount.vue';
export { default as FieldCheckbox } from './components/FormGenerator/FieldCheckbox.vue';
export { default as FieldDMYRange } from './components/FormGenerator/FieldDMYRange.vue';
export { default as FieldMultiselectClear } from './components/FormGenerator/FieldMultiselectClear.vue';
export { default as SearchResultTable } from './components/Search/SearchResultTable.vue';
export { default as SearchToolbar } from './components/Search/SearchToolbar.vue';
export { default as SelectedItemsBasket } from './components/Search/SelectedItemsBasket.vue';

// --- Pass-through (pt) theming ---
export {
    resolvePt,
    usePassThrough,
    bootstrap3Pt,
    BOOTSTRAP_PT_KEY,
} from './components/Bootstrap/usePassThrough';
export type { ComponentPt, BootstrapPt } from './components/Bootstrap/usePassThrough';

// --- Composables ---
export { useActiveFilterTags } from './composables/useActiveFilterTags';
export type { FilterTag } from './composables/useActiveFilterTags';

export { useItemsBasket } from './composables/useItemsBasket';

export { useSearchApi, queryMode } from './composables/useSearchApi';

export { useSearchApp } from './composables/useSearchApp';
export type {
    BuildFilterSchemaContext,
    SearchAppEvent,
    SearchAppConfig,
} from './composables/useSearchApp';

export { useSearchContext } from './composables/useSearchContext';
export type { Context, ResultSet } from './composables/useSearchContext';

export { useSearchHistory } from './composables/useSearchHistory';
export type {
    Filters,
    SearchQuery,
    HistoryState,
    InitialUrlState,
} from './composables/useSearchHistory';

export { useSimpleState } from './composables/useSimpleState';

export { useTableState } from './composables/useTableState';
export type { TableState, onChangeCallback } from './composables/useTableState';

export { useVueFormGeneratorCollapsibleGroups } from './composables/useVueFormGeneratorCollapsibleGroups';

export { useVueFormGenerator } from './composables/useVueFormGenerator';
export type {
    Model,
    Field,
    Fields,
    Group,
    Groups,
    Schema,
    ValidatorFn,
} from './composables/useVueFormGenerator';

// --- Helpers ---
export { default as FormGeneratorFieldCreator } from './helpers/FormGeneratorFieldCreator.js';
