import {useSimpleState} from "./useSimpleState.ts";

/** A row id: numeric, or a composite string key such as "copy:12". */
export type ItemId = number | string;

/**
 * Sort comparator for ids: numbers numerically, strings naturally
 * ("copy:9" before "copy:10").
 */
export function compareIds(a: ItemId, b: ItemId): number {
    if (typeof a === 'number' && typeof b === 'number') {
        return a - b;
    }
    return String(a).localeCompare(String(b), undefined, {numeric: true});
}

/**
 * Manage the set of selected row ids ("items basket") for a search page.
 *
 * This is a pure id-set: it has no knowledge of the result rows or their id
 * property. The result table decides which ids to add or remove (it knows which
 * rows are on the page and which are selected) and calls `addSelectedIds` /
 * `removeSelectedIds`. That keeps the basket decoupled from result data and
 * trivial to reuse and test.
 *
 * @param initialIds ids selected from the start (default none)
 */
export function useItemsBasket(initialIds: ItemId[] = []) {

    const {state: selectedIds, setState: setSelectedIds} = useSimpleState<ItemId[]>(initialIds);

    /** Add the given ids to the selection (union, kept sorted). */
    function addSelectedIds(ids: ItemId[]) {
        setSelectedIds([...new Set([...selectedIds.value, ...ids])].sort(compareIds));
    }

    /** Remove the given ids from the selection. */
    function removeSelectedIds(ids: ItemId[]) {
        const toRemove = new Set(ids);
        setSelectedIds(selectedIds.value.filter((id) => !toRemove.has(id)));
    }

    /** Remove the selected id at the given position (used by the basket dropdown). */
    function removeSelectedIndex(index: number) {
        selectedIds.value.splice(index, 1);
    }

    return {
        selectedIds,
        setSelectedIds,
        addSelectedIds,
        removeSelectedIds,
        removeSelectedIndex,
    }
}
