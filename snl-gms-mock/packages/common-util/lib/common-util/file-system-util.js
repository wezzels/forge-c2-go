import parse from 'csv-parse/lib/sync';
import fs from 'fs';
import { jsonPretty } from './json-util';
import { Logger } from './logger';
const logger = Logger.create('GMS_LOG_FILE_SYSTEM_UTIL');
/**
 * Reads the provided source JSON file into memory
 *
 * @param jsonFilePath The JSON filename from which to read the JSON content
 */
export function readJsonData(jsonFilePath) {
    const fileContents = fs.readFileSync(jsonFilePath, 'utf8');
    return JSON.parse(fileContents);
}
/**
 * Write the formatted JSON to file used by other write to file functions
 *
 * @param filePath
 * @param json
 */
export function writeJsonToFile(filePath, json) {
    fs.writeFile(filePath, json, err => {
        if (err) {
            logger.warn(err.message);
        }
    });
}
/**
 * Writes provided object to file stringify and pretty
 *
 * @param object object to stringify and written to a file
 * @param fileName filename doNOT include extension
 */
export function writeJsonPretty(object, fileName) {
    writeJsonToFile(`${fileName}.json`, jsonPretty(object));
}
/**
 * Saves given object to file
 * This will save us time from copying data from the terminal
 *
 * @param object object to save to file
 * @param filePath file path including file name
 */
export function writeObjectToJsonFile(object, filePath) {
    writeJsonToFile(filePath, JSON.stringify(object, undefined, 2));
}
/** Utility functions for handling CSV files and other file related utils */
/**
 * Reads the provided source CSV file into memory
 *
 * @param csvFilePath
 */
export function readCsvData(csvFilePath) {
    const fileContents = fs.readFileSync(csvFilePath, 'utf8');
    return parse(fileContents, { columns: true, delimiter: '\t' });
}
//# sourceMappingURL=file-system-util.js.map