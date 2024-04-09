import {printMatrix} from "./output.js";

const findPrintWay2 = (matrix, sqrMatrix) => {
    let result = [];
    const count = sqrMatrix[0].length;
    for (let i = 0; i < count; i++){
        for (let j = 0; j < count; j++){
            if (sqrMatrix[i][j] === 0) continue;
            for (let k = 0; k < count; k++){
                if (matrix[k][j] === 1 && matrix[i][k] === 1 && (k !== j || k !== i)){
                    result.push([i + 1, k + 1, j + 1]);
                }
            }
        }
    }
    console.log("Start of printing 2 length ways>>>");
    printMatrix(result, ' -> ');
    console.log("<<<End of printing 2 length ways");
    console.log('\n');
}

const findPrintWays3 = (matrix, cbMatrix) => {
    let result = [];
    const count = cbMatrix[0].length;
    for (let i = 0; i < count; i++){
        for (let j = 0; j < count; j++){
            if (cbMatrix[i][j] === 0) continue;
            for (let k = 0; k < count; k++){
                if (matrix[i][k] === 1){
                    for (let f = 0; f < count; f++){
                        if (matrix[f][j] === 1){
                            if (matrix[k][f] === 1 && k !== f)
                                result.push([i + 1, k + 1, f + 1, j + 1])
                        }
                    }
                }
            }
        }
    }
    console.log("Start of printing 3 length ways>>>");
    printMatrix(result, ' -> ');
    console.log("<<<End of printing 3 length ways");
    console.log('\n');
}

export {findPrintWay2, findPrintWays3}