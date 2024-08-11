/**
 * @typedef {Object.<string, any>} FilterObject - Generalizing to handle any kind of nested objects
 */

/**
 * Converts string numbers to actual numbers in the given filter object.
 * @param {FilterObject} filters - The filter object to process.
 * @returns {FilterObject} The processed filter object with string numbers converted to numbers.
 */
function convertStringNumbers(filters) {
    const result = {};

    function processValue(value) {
        if (typeof value === 'string') {
            if (!isNaN(parseInt(value, 10))) {
                return parseInt(value, 10);
            }
            return value;
        } else if (Array.isArray(value)) {
            return value.map(item => processValue(item));
        } else if (typeof value === 'object' && value !== null) {
            return convertStringNumbers(value);
        } else {
            return value;
        }
    }

    for (const [key, conditions] of Object.entries(filters)) {
        if (typeof conditions === 'object' && conditions !== null) {
            result[key] = {};
            for (const [op, value] of Object.entries(conditions)) {
                result[key][op] = processValue(value);
            }
        } else {
            result[key] = processValue(conditions);
        }
    }

    return result;
}

// Export the function itself, not its result
module.exports = convertStringNumbers;
