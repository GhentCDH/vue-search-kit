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
        <div class="col-lg-4 d-flex align-items-lg-center justify-content-lg-end">
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
import {useI18n} from "vue-i18n";

const {t} = useI18n()

withDefaults(defineProps<{
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
}>(), {
    perPageLabel: null,
    labelFirst: null,
    labelPrevious: null,
    labelNext: null,
    labelLast: null,
});

const emit = defineEmits<{
    // a pagination/per-page change as a TableState patch (wire to updateTableState)
    (e: 'change', patch: Partial<TableState>): void;
}>();
</script>

<i18n>
{
    "en": {
        "searchToolbar": {
            "perPage": "Per page"
        }
    },
    "fr": {
        "searchToolbar": {
            "perPage": "Par page"
        }
    }
}
</i18n>
