import React from 'react';
interface FilterDropdownProps {
    label: string;
    options: {
        value: string;
        label: string;
    }[];
    value: string;
    onChange: (value: string) => void;
}
export declare const FilterDropdown: React.FC<FilterDropdownProps>;
export default FilterDropdown;
//# sourceMappingURL=FilterDropdown.d.ts.map