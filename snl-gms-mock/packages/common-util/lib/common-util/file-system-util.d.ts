/**
 * Reads the provided source JSON file into memory
 *
 * @param jsonFilePath The JSON filename from which to read the JSON content
 */
export declare function readJsonData<T = any>(jsonFilePath: string): T[];
/**
 * Write the formatted JSON to file used by other write to file functions
 *
 * @param filePath
 * @param json
 */
export declare function writeJsonToFile(filePath: string, json: string): void;
/**
 * Writes provided object to file stringify and pretty
 *
 * @param object object to stringify and written to a file
 * @param fileName filename doNOT include extension
 */
export declare function writeJsonPretty(object: unknown, fileName: string): void;
/**
 * Saves given object to file
 * This will save us time from copying data from the terminal
 *
 * @param object object to save to file
 * @param filePath file path including file name
 */
export declare function writeObjectToJsonFile(object: unknown, filePath: string): void;
/** Utility functions for handling CSV files and other file related utils */
/**
 * Reads the provided source CSV file into memory
 *
 * @param csvFilePath
 */
export declare function readCsvData(csvFilePath: string): any[];
//# sourceMappingURL=file-system-util.d.ts.map