<template>
    <b-dropdown class="active ms-auto">
        <template #display>
            {{ message ? tGlobal(message, { count: selectedIds.length }) : t('selectedItemsBasket.message', { count: selectedIds.length }) }}
        </template>

        <li class="dropdown-header">
            <button class="btn" @click="() => {setSelectedIds([])}"> {{ t('selectedItemsBasket.unselectAll') }}</button>
        </li>
        <li v-if="selectedIds.length" class="dropdown-header">
            <b-link class="btn" target="_blank"
               :href="getContextualDetailUrl(selectedIds[0])"
               @navigate="() => { if (selectedIds.length) saveSelectionContext(selectedIds[0]); }"
            >
                {{ viewLabel ?? t('selectedItemsBasket.view') }}
            </b-link>
        </li>
        <li v-for="(id, index) in selectedIds" :key="id"
            class="dropdown-item d-flex justify-content-evenly align-items-center">
            <b-link class="btn btn-tertiary btn-sm" target="_blank"
               :href="getContextualDetailUrl(id)"
               @navigate="saveSelectionContext(id)"
            >
                {{id}}
            </b-link>
            <button class="btn-close btn-sm" @click="removeSelectedIndex(index)"></button>
        </li>
    </b-dropdown>
</template>

<script setup lang="ts">
import BDropdown from "../Bootstrap/BDropdown.vue";
import BLink from "../Bootstrap/BLink.vue";
import {useI18n} from "vue-i18n";
import type {ItemId} from "../../composables/useItemsBasket.ts";

// t: this component's own messages (<i18n> block); tGlobal: the app's messages, for the message key passed in
const { t } = useI18n()
const { t: tGlobal } = useI18n({ useScope: 'global' })

const props = defineProps<{
    selectedIds: ItemId[];
    getContextualDetailUrl: (id: ItemId) => string;
    setSelectedIds: (ids: ItemId[]) => void;
    removeSelectedIndex: (index: number) => void;
    saveSelectionContext: (id: ItemId) => void;
    /** App i18n key (global scope) for the basket label, pluralized by the number of selected items. */
    message?: string;
    /** Label of the link that opens the selection (default: translated "View selection"). */
    viewLabel?: string;
}>();
</script>

<i18n>
{
    "en": {
        "selectedItemsBasket": {
            "message": "No item selected | {count} item selected | {count} items selected",
            "unselectAll": "Unselect all",
            "view": "View selection"
        }
    },
    "fr": {
        "selectedItemsBasket": {
            "message": "Aucun élément sélectionné | {count} élément sélectionné | {count} éléments sélectionnés",
            "unselectAll": "Tout désélectionner",
            "view": "Voir la sélection"
        }
    }
}
</i18n>