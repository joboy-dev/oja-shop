/**
 * Recursively converts a JavaScript object into a FormData object.
 * Handles nested objects, arrays, and File/Blob objects.
 * Uses bracket notation for nested keys (e.g., "parent[child]", "array[0][prop]").
 *
 * @param obj The object to convert.
 * @param formData The FormData instance to append to (optional, a new one will be created if not provided).
 * @param parentKey The base key for recursion (optional, used internally for nesting).
 * @returns A FormData object.
 */
export function objectToFormData(
    obj: Record<string, any>,
    formData: FormData = new FormData(),
    parentKey: string | undefined = undefined,
    sendEmptyStringsForNull: boolean = false
): FormData {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            const formKey = parentKey ? `${parentKey}[${key}]` : key;

            if (
                value === null ||
                value === undefined ||
                value === "null" ||
                value === "undefined"
            ) {
                if (sendEmptyStringsForNull) {
                    // Only append an empty string if sendEmptyStringsForNull is true
                    formData.append(formKey, '');
                }
                continue; 
            } else if (value instanceof FileList) {
                console.log('File list detected', value)
                Array.from(value).forEach(file => {
                    console.log('File detected', file)
                    formData.append(formKey, file, file.name); // Append each file with the SAME key
                });
                continue; 
            } else if (value instanceof File || value instanceof Blob) {
                formData.append(formKey, value, value instanceof File ? value.name : 'blob');
            } else if (Array.isArray(value)) {
                value.forEach((element, index) => {
                    if (
                        element === null ||
                        element === undefined ||
                        element === "null" ||
                        element === "undefined"
                    ) {
                        return;
                    }
                    if (typeof element === 'object' && element !== null) {
                        // You can recurse here if you want to support nested objects in arrays
                        // objectToFormData(element, formData, `${formKey}[${index}]`);
                        formData.append(formKey, String(element));
                    } else {
                        formData.append(formKey, String(element));
                    }
                });
            } else if (typeof value === 'object') {
                objectToFormData(value, formData, formKey);
            } else {
                formData.append(formKey, String(value));
            }

        }
    }
    return formData;
}