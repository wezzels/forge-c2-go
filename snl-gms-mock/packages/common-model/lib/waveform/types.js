export const DEFAULT_SAMPLE_RATE = 1;
export const UNFILTERED = 'Unfiltered';
export const UNFILTERED_FILTER = {
    id: UNFILTERED,
    name: UNFILTERED,
    sampleRate: undefined
};
// Enum to clarify load interactions
export var LoadType;
(function (LoadType) {
    LoadType[LoadType["Earlier"] = 0] = "Earlier";
    LoadType[LoadType["Later"] = 1] = "Later";
})(LoadType || (LoadType = {}));
//# sourceMappingURL=types.js.map