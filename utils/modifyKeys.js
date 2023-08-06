const modifyKeys = (keysToModify, result) => {
    keysToModify.forEach(key => {
        const index = key.indexOf('_');
        let newKey = key.replace('_', '');
        newKey = newKey.split('');
        newKey[index] = newKey[index].toUpperCase();
        newKey = newKey.join('');
        result[newKey] = result[key];
        delete result[key];
    });
}
module.exports = {modifyKeys};