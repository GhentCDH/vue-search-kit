/** One entry of the sort select in SearchToolbar. */
export type SortOption = {
    label: string;
    orderBy: string;
    orderAsc: boolean;
}

/** The order a sort option applies (`v-model:sort` of SearchToolbar). */
export type SortValue = {
    orderBy: string;
    orderAsc: boolean;
}

/** A highlight field shown by SearchHighlights: the backend key and its label. */
export type HighlightField = {
    key: string;
    label: string;
}
