'use strict'

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const VERTEX_COUNT = 10;
const VERTEX_RADIUS = 15;
const N = 3105;

const k1 = (variant) => {
    return  1.0 - variant[2] * 0.01 - variant[3] * 0.01 - 0.3;
}

const k2 = (variant) => {
    return  1.0 - variant[2] * 0.005 - variant[3] * 0.005 - 0.27;
}

const vector = (x1, y1, x2, y2) => {
    const x = x2 - x1,
        y = y2 - y1;
    return {
        x: x,
        y: y
    }
}

const vectorModule = (vector) => {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}

const pseudoRandom = (seed) => {
    let value = seed;

    return function() {
        value = (value * 1103515245 + 12345) % 2147483648;
        return value % 100 < 19;
    }
}


const createDirMatrix = (n, k) => {
    const n1 = Math.floor(n / 1000),
        n2 = Math.floor((n - n1 * 1000) / 100),
        n3 = Math.floor((n - n1 * 1000 - n2 * 100) / 10),
        n4 = Math.floor((n - n1 * 1000 - n2 * 100 - n3 * 10))
    const variant = [n1, n2, n3, n4];
    const count = 10 + variant[2];
    const generator = pseudoRandom(n);
    let matrix = new Array(count);
    for (let i = 0; i < count; i++) {
        matrix[i] = new Array(count);
    }
    const coef = k(variant);
    for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
            matrix[i][j] = Math.floor(generator() * 2 * coef);
        }
    }
    return matrix;
}

const undirMatrix = (arr) => {
    let matrix = arr;
    for (let i = 0; i < matrix.length; i++){
        for (let j = 0; j < matrix[i].length; j++){
            if (matrix[i][j] === 1){
                matrix[j][i] = 1;
            }
        }
    }
    return matrix;
}

const findVertexCoord = (vertexCount, firstCoordX, firstCoordy) => {
    let Coords = {
        xCoord: [],
        yCoord: []
    }

    Coords.xCoord[0] = firstCoordX;
    Coords.yCoord[0] = firstCoordy;
    for (let i = 1; i < vertexCount; i++){
        switch (i) {
            case 1:
            case 2:
            case 3: {
                Coords.xCoord[i] = Coords.xCoord[i - 1] + 60;
                Coords.yCoord[i] = Coords.yCoord[i - 1] + 100;
                break;
            }
            case 4:
            case 5:
            case 6:
            case 7: {
                Coords.xCoord[i] = Coords.xCoord[i - 1] - 90;
                Coords.yCoord[i] = Coords.yCoord[i - 1];
                break;
            }
            case 8:
            case 9: {
                Coords.xCoord[i] = Coords.xCoord[i - 1] + 60;
                Coords.yCoord[i] = Coords.yCoord[i - 1] - 100;
                break;
            }
            default: {
                break;
            }
        }
    }
    return Coords;
}

const drawOnlyVertex = (Coords, i) => {
    ctx.beginPath();
    ctx.arc(Coords.xCoord[i], Coords.yCoord[i], VERTEX_RADIUS, 0, Math.PI * 2);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.fillText((i + 1).toString(), Coords.xCoord[i], Coords.yCoord[i]);
    ctx.closePath();
}

const drawVertexes = (ctx, count, x, y) => {
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < count; i++) {
        const Coords = findVertexCoord(count, x, y);
        drawOnlyVertex(Coords, i);
    }
}

const lineVal = (Coords, i, j) => {
    const startX = Coords.xCoord[i];
    const startY = Coords.yCoord[i];
    const endX = Coords.xCoord[j];
    const endY = Coords.yCoord[j];
    const vector1 = vector(startX, startY, endX, endY);
    const a = vectorModule(vector1);
    let valResult = null;
    for (let k = 0; k < Coords.xCoord.length; k++){
        if(k === i || k === j) continue;
        if(Math.abs(j - i) === 1) break;
        const vector2 = vector(startX, startY, Coords.xCoord[k], Coords.yCoord[k]);
        const vector3 = vector(Coords.xCoord[k], Coords.yCoord[k], endX, endY);
        const b = vectorModule(vector2);
        const c = vectorModule(vector3);
        const p = (a + b + c) / 2;
        const height = Math.sqrt(p * (p - a) * (p - b) * (p - c)) * 2 / a;
        if (height < VERTEX_RADIUS) {
            valResult = a;
            break;
        }
    }
    return valResult;
}

const matrixOutput = (matrix, tableId) => {
    return document.addEventListener("DOMContentLoaded", function() {

        const table = document.getElementById(tableId);

        let headerRow = table.insertRow();
        headerRow.insertCell();
        for (let j = 0; j < matrix[0].length; j++) {
            let cell = headerRow.insertCell();
            cell.textContent = j + 1 + " - ";
        }

        for (let i = 0; i < matrix.length; i++) {
            let row = table.insertRow();
            let rowNumberCell = row.insertCell();
            rowNumberCell.textContent = i + 1 + " - ";

            for (let j = 0; j < matrix[i].length; j++) {
                let cell = row.insertCell();
                cell.textContent = matrix[i][j] + " - ";
            }
        }
    });
}

const drawStitch = (Coords, i) => {
    ctx.beginPath();
    ctx.moveTo(Coords.xCoord[i], Coords.yCoord[i]);
    ctx.arc(Coords.xCoord[i] - VERTEX_RADIUS, Coords.yCoord[i] - VERTEX_RADIUS,
        VERTEX_RADIUS, Math.PI * 2, 0);
    ctx.stroke();
    ctx.closePath();
}

const drawLine = (Coords, i, j) => {
    ctx.beginPath();
    ctx.moveTo(Coords.xCoord[i], Coords.yCoord[i]);
    ctx.lineTo(Coords.xCoord[j], Coords.yCoord[j]);
    ctx.stroke();
    ctx.closePath();
}

const drawEllipse = (Coords, i, j, angle) => {
    const endX = Coords.xCoord[j] - VERTEX_RADIUS * Math.cos(angle);
    const endY = Coords.yCoord[j] - VERTEX_RADIUS * Math.sin(angle);
    const startX = Coords.xCoord[i],
        startY = Coords.yCoord[i]
    const middleX = (startX + endX) / 2;
    const middleY = (startY + endY) / 2;
    const newAngle = Math.atan2((endY - startY), (endX - startX));
    const radius = vectorModule(vector(startX, startY, endX, endY))
    ctx.beginPath();
    ctx.moveTo(Coords.xCoord[i], Coords.yCoord[i]);
    ctx.ellipse(middleX, middleY, radius / 2, VERTEX_RADIUS * 2,
        newAngle, Math.PI, 0);
    ctx.stroke();
    ctx.closePath();
    return newAngle;
}

const drawArrows = (angle, xArrow, yArrow, n = 0) => {
    let leftX,
        rightX,
        leftY,
        rightY;
    if (n === 1){
        leftX = xArrow - 15 * Math.cos(angle + 0.5 + Math.PI / 3);
        rightX = xArrow - 15 * Math.cos(angle - 0.5 + Math.PI / 3);
        leftY = yArrow - 15 * Math.sin(angle + 0.5 + Math.PI / 3);
        rightY = yArrow - 15 * Math.sin(angle - 0.5 + Math.PI / 3);
    }
    else {
        leftX = xArrow - 15 * Math.cos(angle + 0.5);
        rightX = xArrow - 15 * Math.cos(angle - 0.5);
        leftY = yArrow - 15 * Math.sin(angle + 0.5);
        rightY = yArrow - 15 * Math.sin(angle - 0.5);
    }
    ctx.beginPath();
    ctx.moveTo(xArrow, yArrow);
    ctx.lineTo(leftX, leftY);
    ctx.moveTo(xArrow, yArrow);
    ctx.lineTo(rightX, rightY);
    ctx.stroke();
    ctx.closePath();
}

const arrow = (Coords, j, angle, vertexRadius, n) => {
    const xArrow = Coords.xCoord[j] - vertexRadius * Math.cos(angle);
    const yArrow = Coords.yCoord[j] - vertexRadius * Math.sin(angle);
    drawArrows(angle, xArrow, yArrow, n);
}

const calculateAngle = (Coords, i, j) => {
    const startX = Coords.xCoord[i];
    const startY = Coords.yCoord[i];
    const endX = Coords.xCoord[j];
    const endY = Coords.yCoord[j];
    return Math.atan2(endY - startY, endX - startX);
}

const drawDirMatrixEdges = (x, y, n, k) => {
    const matrix = createDirMatrix(n, k);
    const Coords = findVertexCoord(VERTEX_COUNT, x, y);
    for (let i = 0; i < VERTEX_COUNT; i++) {
        for (let j = 0; j < VERTEX_COUNT; j++) {
            if (matrix[i][j] === 1) {
                const angle = calculateAngle(Coords, i, j);
                const val = lineVal(Coords, i, j);
                if (i === j) {
                    drawStitch(Coords, i);
                    arrow(Coords, j, angle, VERTEX_RADIUS);
                }
                else if (matrix[j][i] === 1 && i > j || val !== null){
                    const valid = 1;
                    drawEllipse(Coords, i, j, angle);
                    arrow(Coords, j, angle, VERTEX_RADIUS, valid);
                }
                else {
                    drawLine(Coords, i, j);
                    arrow(Coords, j, angle, VERTEX_RADIUS);
                }
            }
        }
    }
}

const drawUndirMatrixEdges = (x, y, n, k) => {
    const matrix = undirMatrix(createDirMatrix(n, k));
    const Coords = findVertexCoord(VERTEX_COUNT, x, y);
    for (let i = 0; i < VERTEX_COUNT; i++) {
        for (let j = 0; j <= i; j++) {
            if (matrix[i][j] === 1) {
                const angle = calculateAngle(Coords, i, j);
                const val = lineVal(Coords, i, j);
                if (i === j) {
                    drawStitch(Coords, i);
                }
                else if (val !== null){
                    drawEllipse(Coords, j, i, angle);
                }
                else{
                    drawLine(Coords, i, j);
                }
            }
        }
    }
}

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
                if (i === j) counter++;
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
    console.log('<<< The end of counting entering powers for vertexes in directed matrix');
    console.log("\n");
}

const checkGraphRegular = (matrix, powerDir) => {
    const val = powerDir[0];
    for (const item of powerDir) {
        if (val !== item) {
            console.log("<<< This graph is not regular >>>");
            console.log("\n");
            return -1;
        }
    }
    console.log("<<< This graph is regular >>>");
    console.log("\n");
    return 1;
}

const isolAndHangingVertexes = (arr) => {
    const val = "the list is empty"
    let isolResult = [],
        hangResult = [];
    for (let i = 0; i < arr.length; i++){
        if (arr[i] === 1){
            hangResult.push(i + 1);
        }
        else if (arr[i] === 0){
            isolResult.push(i + 1);
        }
    }
    console.log(`The list of isolated vertexes in the array: ${
        isolResult.length !== 0 ? isolResult.join() : val
    }.`);
    console.log(`The list of hanged vertexes in the array: ${
        hangResult.length !== 0 ?  hangResult.join() : val
    }.`);
    console.log('\n');
}

const multMatrix = (matrix1, matrix2) => {
    const count = matrix1[0].length;
    let result = new Array(count);
    for (let i = 0; i < count; i++) {
        result[i] = new Array(count);
    }
    for (let i = 0; i < matrix1[0].length; i++){
        for (let j = 0; j < matrix1[0].length; j++){
            let res = 0;
            for (let k = 0; k < matrix1[0].length; k++){
                res += matrix1[i][k] * matrix2[k][j];
            }
            result[i][j] = res;
        }
    }
    return result;
}

const squareMatrix = (matrix) => {
    return multMatrix(matrix, matrix);
}

const cubeMatrix = (matrix) => {
    return multMatrix(matrix, multMatrix(matrix, matrix));
}

const printMatrix = (matrix, joiner= ', ') => {
    matrix.forEach((row, index) => {
        console.log(`${index + 1}) ` + row.join(joiner));
    });
}

const findPrintWay2 = (matrix, sqrMatrix) => {
    let result = [];
    const count = sqrMatrix[0].length;
    for (let i = 0; i < count; i++){
        for (let j = 0; j < count; j++){
            if (sqrMatrix[i][j] === 0) continue;
            for (let k = 0; k < count; k++){
                //if (i === j) continue;
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

const reachMatrix = (matrix) => {
    const count = matrix[0].length;
    let matrixObject = {
        1: matrix,
    };
    for (let i = 2; i <= count - 1; i++){
        const num = i - 1
        matrixObject[`${i}`] = multMatrix(matrix, matrixObject[`${num}`]);
    }
    let result = new Array(count);
    for (let i = 0; i < count; i++) {
        result[i] = new Array(count);
    }
    for (let i = 0; i < count; i++){
        for (let j = 0; j < count; j++){
            let val = false;
            for (let key in matrixObject) {
                if (matrixObject[key][i][j] > 0){
                    val = true;
                    break;
                }
            }
            if (val || i === j) result[i][j] = 1;
            else result[i][j] = 0;
        }
    }
    return result;
}

const printReachMatrix = (matrix) => {
    console.log("Start of printing reachability matrix>>>");
    printMatrix(reachMatrix(matrix));
    console.log("<<<End of printing reachability matrix");
    console.log('\n');
}

const transMatrix = (matrix) => {
    const count = matrix[0].length;
    let result = new Array(count);
    for (let i = 0; i < count; i++) {
        result[i] = new Array(count);
    }
    for (let i = 0; i < count; i++){
        for (let j = 0; j < count; j++){
            result[i][j] = matrix[j][i];
        }
    }
    return result;
}

const strongMatrix = (matrix) => {
    const count = matrix[0].length;
    const trans = transMatrix(matrix);
    const result = matrix;
    for (let i = 0; i < count; i++){
        for (let j = 0; j < count; j++){
            result[i][j] = trans[i][j] * matrix[i][j];
        }
    }
    return result;
}

const printStrongMatrix = (matrix) => {
    console.log("Start of printing strong connectivity matrix>>>");
    printMatrix(strongMatrix(matrix));
    console.log("<<<End of printing strong connectivity matrix");
    console.log('\n');
}

const convertMatrixToString = (matrix) => {
    let result = {};
    matrix.forEach((row, index) => result[index] = row.join(''));
    return result;
}

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

const drawCondVertex = (Coords, i) => {
    ctx.beginPath();
    ctx.arc(Coords.xCoord[i], Coords.yCoord[i], VERTEX_RADIUS, 0, Math.PI * 2);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.fillText(`K${parseInt(i)+1}`, Coords.xCoord[i], Coords.yCoord[i]);
    ctx.closePath();
}

const findNumInComp = (matrix, obj, k) => {
    let numArr = [],
        result = [];
    for (let counter = 0; counter < obj.length; counter++){
        if (counter !== k){
            for (let i = 0; i < matrix.length; i++){
                if (matrix[counter][i] === 1){
                    numArr.push(i);
                }
            }
        }
    }
    for (let i = 0; i < obj.length; i++){
        for (let j = 0; j < numArr.length; j++){
            if (obj[i].includes(numArr[j].toString())){
                result.push(i);
            }
        }
    }
    return result;
}

const drawCondGraph = (matrix, obj, x, y) => {
    const Coords = findVertexCoord(VERTEX_COUNT, x, y);
    let CondCoords = {
            xCoord: [],
            yCoord: []
        },
        pointer = 0,
        arr = [],
        val = {
            start: [],
            end: []
        }

    Object.entries(obj).forEach(([, value]) => {
        CondCoords.xCoord.push(Coords.xCoord[value[0]]);
        CondCoords.yCoord.push(Coords.yCoord[value[0]]);
        arr.push(value.map((value) => parseInt(value)));
    });
    for (let i = 0; i < arr.length; i++){
        for (let j = 0; j < arr[i].length; j++){
            for (let k = 0; k < matrix[0].length; k++) {
                if (matrix[k][arr[i][j]] === 1 && arr[i][j] !== k){
                    for (let h = 0; h < arr.length; h++){
                        const index = arr[h].indexOf(k);
                        if (index >= 0 && h !== i){
                            val.start.push(h);
                            val.end.push(i);
                        }
                    }
                }
            }
        }
    }

    console.log(val);
    for (let i = 0; i < val.start.length; i++){
        if (checkRepeat(val, i)){
            const angle = calculateAngle(CondCoords, val.start[i], val.end[i]);
            drawLine(CondCoords, val.start[i], val.end[i]);
            arrow(CondCoords, val.end[i], angle, VERTEX_RADIUS);
        }
    }
    Object.entries(obj).forEach(() => {
        drawCondVertex(CondCoords, pointer);
        pointer++;
    });
}

const checkRepeat = (val, i) => {
    const startC = val.start[i],
        endC = val.end[i];
    let result = true
    for (let j = 0; j < val.start.length; j++){
        if (startC === val.start[j] && endC === val.end[j] && j > i){
            result = false;
        }
    }
    return result
}
const componentsOutput = (object) => {
    let arr = [];
    Object.entries(object).forEach(([, value]) => {
        arr.push(value.map((value) => parseInt(value)));
    });
    arr.forEach((arr) => console.log(`Components of strong connectivity are: {${arr.map(value => value + 1).join(', ')}}`))
}

const matrix = createDirMatrix(N, k1)
const undMatrix = undirMatrix(createDirMatrix(N, k1));
// drawUndirMatrixEdges(300, 180, N, k1);
drawDirMatrixEdges(800, 180, N, k1);
// drawVertexes(ctx, VERTEX_COUNT, 300, 180);
drawVertexes(ctx, VERTEX_COUNT, 800, 180);
matrixOutput(matrix, "dirMatrixTable");
matrixOutput(undMatrix, "undirMatrixTable")


const dirPow = findDirMatrixPower(matrix);
findUndirMatrixPower(undMatrix);
findDirMatrixEnterPower(matrix);
findDirMatrixExitPower(matrix);
checkGraphRegular(matrix, dirPow);
isolAndHangingVertexes(dirPow);

const matrix2 = createDirMatrix(N, k2);
drawDirMatrixEdges(1300, 180, N, k1);
drawVertexes(ctx, VERTEX_COUNT, 1300, 180);
findDirMatrixEnterPower(matrix2);
findDirMatrixExitPower(matrix2);
const res = squareMatrix(matrix2);
const res2 = cubeMatrix(matrix2);

findPrintWay2(matrix2, res);
findPrintWays3(matrix2, res2);
printReachMatrix(matrix2);
const cond = findComponents(convertMatrixToString(strongMatrix(reachMatrix(matrix2))));
componentsOutput(cond);
drawCondGraph(matrix2, cond, 300, 180);
printStrongMatrix(reachMatrix(matrix2));