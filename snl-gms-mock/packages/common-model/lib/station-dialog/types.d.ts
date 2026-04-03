export declare const FilterCategoryLabels: readonly ["Station Group", "Custom Station List", "Station Type", "Channel Data Type", "Channel Band Type", "Channel Instrument Type", "Channel Orientation Code"];
/** Possible filter categories for the station selector dialog */
export type FilterCategoryLabel = (typeof FilterCategoryLabels)[number];
/**
 * Represents a Station Filter within a filtering category
 */
export interface CheckboxFilter {
    /** flag for the filter checkbox */
    isChecked: boolean;
    /** label for the filter */
    label?: string;
}
/**
 * Collection of filters
 */
export interface CheckboxFilterCategory {
    categoryLabel: FilterCategoryLabel;
    /** filter label paired to a corresponding filter */
    filters: Record<string, CheckboxFilter>;
}
/** Collection of filter categories */
export type CheckboxFilterCategories = Record<FilterCategoryLabel, CheckboxFilterCategory>;
//# sourceMappingURL=types.d.ts.map