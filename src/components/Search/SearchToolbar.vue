<template>
    <nav class="row form-group">
        <div class="col-lg-4 d-flex align-items-lg-center">
            <b-pagination
                :total-records="totalRecords"
                :per-page="tableState.rowsPerPage"
                :page="tableState.currentPage"
                :label-first="labelFirst"
                :label-previous="labelPrevious"
                :label-next="labelNext"
                :label-last="labelLast"
                @update:page="(page) => emit('change', { currentPage: parseInt(page) })"
            ></b-pagination>
        </div>
        <div class="col-lg-4 d-flex align-items-lg-center justify-content-lg-center">
            <record-count
                :per-page="tableState.rowsPerPage"
                :total-records="totalRecords"
                :page="tableState.currentPage"
            ></record-count>
        </div>
        <div class="col-lg-4 d-flex align-items-lg-center justify-content-lg-end gap-2">
            <b-select v-if="sortOptions.length"
                      id="sort-by"
                      :label="sortLabel ?? t('searchToolbar.sortBy')"
                      :selected="selectedSortIndex"
                      :options="sortSelectOptions"
                      @update:selected="onSortSelected"
                      class="w-auto"
            ></b-select>
            <b-select id="per-page"
                      :label="perPageLabel ?? t('searchToolbar.perPage')"
                      :selected="tableState.rowsPerPage"
                      :options="perPageValues.map((value) => ({ value, text: value }))"
                      @update:selected="(value) => emit('change', { rowsPerPage: parseInt(value) })"
                      class="w-auto"
            ></b-select>
        </div>
    </nav>
</template>

<script setup lang="ts">
import BPagination from "../Bootstrap/BPagination.vue";
import BSelect from "../Bootstrap/BSelect.vue";
import RecordCount from "../Bootstrap/RecordCount.vue";
import type {TableState} from "../../composables/useTableState";
import type {SortOption, SortValue} from "./types.ts";
import {computed} from "vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n()

const props = withDefaults(defineProps<{
    tableState: TableState;
    totalRecords: number;
    perPageValues: number[];
    /** Label of the per-page select; defaults to a translated "Per page". */
    perPageLabel?: string | null;
    /** Pagination button labels, forwarded to BPagination (default: its own translations). */
    labelFirst?: string | null;
    labelPrevious?: string | null;
    labelNext?: string | null;
    labelLast?: string | null;
    /** Orders offered in a sort select; the select is hidden when empty. */
    sortOptions?: SortOption[];
    /** Accessible label of the sort select; defaults to a translated "Sort by". */
    sortLabel?: string | null;
}>(), {
    sortOptions: () => [],
    sortLabel: null,
    perPageLabel: null,
    labelFirst: null,
    labelPrevious: null,
    labelNext: null,
    labelLast: null,
});

const emit = defineEmits<{
    // a pagination/per-page change as a TableState patch (wire to updateTableState)
    (e: 'change', patch: Partial<TableState>): void;
    // the order picked in the sort select (wire to updateTableState)
    (e: 'update:sort', sort: SortValue): void;
}>();

// option that matches the current order ('' when none does)
const selectedSortIndex = computed(() => {
    const index = props.sortOptions.findIndex((option) =>
        option.orderBy === props.tableState.orderBy && option.orderAsc === props.tableState.orderAsc);
    return index < 0 ? '' : String(index);
});

// when the order is none of the options (e.g. a column header sort), say so instead of showing the first
// option as if it applied (choosing that option would then not even fire a change)
const sortSelectOptions = computed(() => [
    ...(selectedSortIndex.value === '' ? [{value: '', text: t('searchToolbar.otherOrder')}] : []),
    ...props.sortOptions.map((option, index) => ({value: String(index), text: option.label})),
]);

const onSortSelected = (value: string) => {
    if (value === '') return;
    const option = props.sortOptions[Number(value)];
    if (option) {
        emit('update:sort', {orderBy: option.orderBy, orderAsc: option.orderAsc});
    }
};
</script>

<i18n>
{
    "en": {
        "searchToolbar": {
            "perPage": "Per page",
            "sortBy": "Sort by",
            "otherOrder": "Other order"
        }
    },
    "fr": {
        "searchToolbar": {
            "perPage": "Par page",
            "sortBy": "Trier par",
            "otherOrder": "Autre ordre"
        }
    }
}
</i18n>
