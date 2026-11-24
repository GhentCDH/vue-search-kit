import {describe, it, expect} from 'vitest';
import {useItemsBasket} from "../src/composables/useItemsBasket";

describe('useItemsBasket', () => {
    it('keeps numeric ids sorted numerically', () => {
        const {selectedIds, addSelectedIds} = useItemsBasket();
        addSelectedIds([10, 2, 1]);
        expect(selectedIds.value).toEqual([1, 2, 10]);
    });

    it('sorts composite string ids (e.g. "type:id") naturally', () => {
        const {selectedIds, addSelectedIds} = useItemsBasket();
        addSelectedIds(['copy:10', 'original:2', 'copy:9']);
        expect(selectedIds.value).toEqual(['copy:9', 'copy:10', 'original:2']);
    });

    it('removes string ids', () => {
        const {selectedIds, addSelectedIds, removeSelectedIds} = useItemsBasket();
        addSelectedIds(['copy:1', 'original:1']);
        removeSelectedIds(['copy:1']);
        expect(selectedIds.value).toEqual(['original:1']);
    });
});
