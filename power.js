const findUndirMatrixPower = (matrix) => {
    const result = [];
    console.log('Start of counting powers for vertexes in undirected matrix >>>');
    for (let i = 0; i < matrix[0].length; i++){
        let counter = 0;
        for (let j = 0; j < matrix[0].length; j++){
            if (matrix[i][j] === 1){
                if (i === j) counter++;
                counter++;
            }
        }
        console.log(`The power of the vertex number ${i + 1} is ${counter}`);
        result.push(counter);
    }
    console.log('<<< The end of counting powers for vertexes in undirected matrix');
    console.log("\n");
    return result;
}

const findDirMatrixPower = (matrix) => {
    const result = [];
    console.log('Start of counting powers for vertexes in directed matrix >>>');
    for (let i = 0; i < matrix[0].length; i++){
        let counter = 0;
        for (let j = 0; j < matrix[0].length; j++){
            if (matrix[i][j] === 1 || matrix[j][i] === 1){
                if (i === j) counter++;
                counter++;
            }
        }
        result.push(counter);
        console.log(`The power of the vertex number ${i + 1} is ${counter}`);
    }
    console.log('<<< The end of counting powers for vertexes in directed matrix');
    console.log("\n");
    return result;
}

const findDirMatrixEnterPower = (matrix) => {
    console.log('Start of counting entering powers for vertexes in directed matrix >>>');
    for (let i = 0; i < matrix[0].length; i++){
        let counter = 0;
        for (let j = 0; j < matrix[0].length; j++){
            if (matrix[j][i] === 1){
                counter++;
            }
        }
        console.log(`The power of the vertex number ${i + 1} is ${counter}`);
    }
    console.log('<<< The end of counting entering powers for vertexes in directed matrix');
    console.log("\n");
}

const findDirMatrixExitPower = (matrix) => {
    console.log('Start of counting exiting powers for vertexes in directed matrix >>>');
    for (let i = 0; i < matrix[0].length; i++){
        let counter = 0;
        for (let j = 0; j < matrix[0].length; j++){
            if (matrix[i][j] === 1){
                counter++;
            }
        }
        console.log(`The power of the vertex number ${i + 1} is ${counter}`);
    }
    console.log('<<< The end of counting exiting powers for vertexes in directed matrix');
    console.log("\n");
}

export {findDirMatrixExitPower, findUndirMatrixPower, findDirMatrixEnterPower, findDirMatrixPower}