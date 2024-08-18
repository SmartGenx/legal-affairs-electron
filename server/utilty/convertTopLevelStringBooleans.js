/**
 * @typedef {Object<string, string | number | boolean | ComplexFilter>} SimpleFilterObject
 */

/**
 * @typedef {Object} ComplexFilter
 * @property {Object<string, boolean>} [select]
 * @property {Object<string, boolean>} [include]
 */

/**
 * Convert top-level string booleans in filters to actual booleans and handle complex filters.
 *
 * @param {SimpleFilterObject} filters - The filters to convert.
 * @returns {SimpleFilterObject} - The converted filters.
 */
function convertTopLevelStringBooleans(filters) {
    const result = {};
    for (const [key, value] of Object.entries(filters)) {
        if (typeof value === 'string') {
            // Check if the string is 'true' or 'false' and convert accordingly
            if (value.toLowerCase() === 'true') {
                result[key] = true;
            } else if (value.toLowerCase() === 'false') {
                result[key] = false;
            } else {
                // Retain other strings as they are
                result[key] = value;
            }
        } else if (typeof value === 'object' && value !== null) {
            if (value['select']) {
                const selectValue = value['select'];
                const splitArray = selectValue.split('-');
                const select = {};
                for (const item of splitArray) {
                    select[item] = true;
                }
                result[key] = { select: select };
            } else if (value['include']) {
                const includeValue = value['include'];
                const splitArray = includeValue.split('-');
                const include = {};
                for (const item of splitArray) {
                    include[item] = true;
                }
                result[key] = { include: include };
            } else {
                result[key] = value;
            }
        } else {
            result[key] = value;
        }
    }
    return result;
}

// Export the function
module.exports = convertTopLevelStringBooleans;
