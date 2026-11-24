<template>
    <div :class="ptClass('container')">
        <div :class="ptClass('group')">
            <button type="button" data-action="search" :class="ptClass('searchButton')"
                    :title="t('searchBox.search')" :aria-label="t('searchBox.search')"
                    @click="search">
                <i :class="ptClass('icon')" aria-hidden="true"></i>
            </button>
            <input :id="id ?? undefined" type="search" enterkeyhint="search" autocomplete="off"
                   :class="ptClass('input')"
                   :value="text"
                   :placeholder="placeholder ?? undefined"
                   :aria-label="label ?? t('searchBox.label')"
                   @input="onInput"
                   @keydown.enter.prevent="search">
            <button v-if="text" type="button" data-action="clear" :class="ptClass('clearButton')"
                    :title="t('searchBox.clear')" :aria-label="t('searchBox.clear')"
                    @click="clear"></button>
        </div>
        <div v-if="$slots.help" :class="ptClass('help')">
            <slot name="help"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import {onBeforeUnmount, ref, watch} from "vue";
import {useI18n} from "vue-i18n";

import {usePassThrough, type ComponentPt} from "../Bootstrap/usePassThrough.ts";

/**
 * A plain full-text search box: `v-model` holds the text, `search` is emitted
 * on Enter, on the search button, on clear and (when `debounce` > 0) after the
 * user stops typing. The same text is not searched twice in a row.
 */
const props = withDefaults(defineProps<{
    modelValue?: string | null;
    placeholder?: string | null;
    /** Accessible label of the input; defaults to a translated "Search". */
    label?: string | null;
    /** Milliseconds to wait after typing before searching; 0 disables search-as-you-type. */
    debounce?: number;
    id?: string | null;
    pt?: ComponentPt;
}>(), {
    modelValue: '',
    placeholder: null,
    label: null,
    debounce: 600,
    id: null,
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'search', value: string): void;
}>();

const {t} = useI18n();

const defaultPt: ComponentPt = {
    container: 'search-box',
    group: 'input-group input-group-lg',
    searchButton: 'btn btn-outline-secondary',
    icon: 'fa-solid fa-magnifying-glass',
    input: 'form-control',
    clearButton: 'btn btn-outline-secondary btn-close search-box__clear',
    help: 'form-text',
};

const ptClass = usePassThrough('searchBox', defaultPt, () => props.pt);

const text = ref<string>(props.modelValue ?? '');
// the text the app currently searches for: a change from outside (e.g. a
// filter tag being closed) is already applied, so it counts as searched
let searched = text.value;
let timer: ReturnType<typeof setTimeout> | null = null;

watch(() => props.modelValue, (value) => {
    text.value = value ?? '';
    searched = text.value;
});

const cancelTimer = () => {
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
};

const search = () => {
    cancelTimer();
    if (text.value === searched) return;
    searched = text.value;
    emit('search', text.value);
};

const onInput = (event: Event) => {
    text.value = (event.target as HTMLInputElement).value;
    emit('update:modelValue', text.value);
    cancelTimer();
    if (props.debounce > 0) {
        timer = setTimeout(search, props.debounce);
    }
};

const clear = () => {
    text.value = '';
    emit('update:modelValue', '');
    search();
};

onBeforeUnmount(cancelTimer);
</script>

<style scoped lang="scss">
.search-box {
    // the clear button replaces the browser's own one
    input[type="search"]::-webkit-search-cancel-button {
        display: none;
    }

    .search-box__clear {
        height: auto;
        background-size: 0.75em;
    }
}
</style>

<i18n>
{
    "en": {
        "searchBox": {
            "label": "Search",
            "search": "Search",
            "clear": "Clear search"
        }
    },
    "fr": {
        "searchBox": {
            "label": "Rechercher",
            "search": "Rechercher",
            "clear": "Effacer la recherche"
        }
    }
}
</i18n>
