<template>
    <div v-if="items.length" :class="ptClass('container')">
        <div v-for="item in items" :key="item.key" :data-highlight-field="item.key" :class="ptClass('item')">
            <span :class="ptClass('label')">{{ item.label }}</span>
            <!-- fragments come from the backend with the html encoder: text is escaped, only <mark> is markup -->
            <span :class="ptClass('fragments')" v-html="item.fragments.join(separator)"></span>
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed} from "vue";

import {usePassThrough, type ComponentPt} from "../Bootstrap/usePassThrough.ts";
import type {HighlightField} from "./types.ts";

/**
 * Labelled highlight fragments of one search result, e.g. the `_highlight`
 * object a full-text search returns per row (field key => fragments).
 * Fields are shown in the order of `fields`; keys that are not listed, or have
 * no fragments, are skipped.
 */
const props = withDefaults(defineProps<{
    highlights?: Record<string, string[]> | null;
    fields: HighlightField[];
    /** Placed between the fragments of one field. */
    separator?: string;
    pt?: ComponentPt;
}>(), {
    highlights: null,
    separator: ' … ',
});

const defaultPt: ComponentPt = {
    container: 'search-highlights small',
    item: 'search-highlights__item',
    label: 'search-highlights__label fw-semibold me-1',
    fragments: 'search-highlights__fragments',
};

const ptClass = usePassThrough('searchHighlights', defaultPt, () => props.pt);

const items = computed(() => props.fields
    .map((field) => ({...field, fragments: props.highlights?.[field.key] ?? []}))
    .filter((item) => item.fragments.length > 0));
</script>

<style scoped lang="scss">
.search-highlights__label::after {
    content: ':';
}
</style>
