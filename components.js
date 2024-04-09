const findComponents = (inputObj) => {
    const result = {};
    const valueToIndexMap = {};
    let indexCounter = 1;

    Object.entries(inputObj).forEach(([key, value]) => {
        if (!valueToIndexMap[value]) {
            valueToIndexMap[value] = indexCounter;
            result[indexCounter] = [key];
            indexCounter++;
        } else {
            result[valueToIndexMap[value]].push(key);
        }
    });

    return result;
};

export {findComponents};