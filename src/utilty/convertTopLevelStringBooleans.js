/**
 * @typedef {Object} SimpleFilterObject
 * @property {string | number | boolean | { select: { [key: string]: boolean } }} [key]
 */

 /**
 * @param {SimpleFilterObject} filters
 * @returns {SimpleFilterObject}
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
        } else if (typeof value === 'object' && value !== null && value.hasOwnProperty('select')) {
            const selectValue = value['select'];
            const splitArray = selectValue.split('-');
            let select = {};
            for (let i in splitArray) {
                select[`${splitArray[i]}`] = true;
            }
            result[key] = { select: select };
        } else {
            result[key] = value;
        }
    }
    return result;
}

// Export the function
module.exports = convertTopLevelStringBooleans;
