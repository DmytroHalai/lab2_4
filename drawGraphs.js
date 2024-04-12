import {findVertexCoord, calculateAngle, lineVal, checkRepeat} from "./utility.js";
import {drawOnlyVertex, drawStitch, drawLine, arrow, drawEllipse, drawCondVertex} from "./draw.js";
import {createDirMatrix, undirMatrix} from "./matrix.js";

const drawVertexes = (ctx, count, x, y, radius) => {
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < count; i++) {
        const Coords = findVertexCoord(count, x, y);
        drawOnlyVertex(Coords, i, ctx, radius);
    }
}

const drawDirMatrixEdges = (x, y, n, ctx, radius, count, k) => {
    const matrix = createDirMatrix(n, k);
    const Coords = findVertexCoord(count, x, y);
    for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
            if (matrix[i][j] === 1) {
                const angle = calculateAngle(Coords, i, j);
                const val = lineVal(Coords, i, j, radius);
                if (i === j) {
                    drawStitch(Coords, i, ctx, radius);
                    arrow(Coords, j, angle, radius, ctx);
                }
                else if (matrix[j][i] === 1 && i > j || val !== null){
                    const valid = 1;
                    drawEllipse(Coords, i, j, angle, ctx, radius);
                    arrow(Coords, j, angle, radius, ctx, valid);
                }
                else {
                    drawLine(Coords, i, j, ctx);
                    arrow(Coords, j, angle, radius, ctx);
                }
            }
        }
    }
}

const drawUndirMatrixEdges = (x, y, n, ctx, radius, count, k) => {
    const matrix = undirMatrix(createDirMatrix(n, k));
    const Coords = findVertexCoord(count, x, y);
    for (let i = 0; i < count; i++) {
        for (let j = 0; j <= i; j++) {
            if (matrix[i][j] === 1) {
                const angle = calculateAngle(Coords, i, j);
                const val = lineVal(Coords, i, j, radius);
                if (i === j) {
                    drawStitch(Coords, i, ctx, radius);
                }
                else if (val !== null){
                    drawEllipse(Coords, j, i, angle, ctx, radius);
                }
                else{
                    drawLine(Coords, i, j, ctx);
                }
            }
        }
    }
}

const drawCondGraph = (matrix, obj, x, y, count, radius, ctx) => {
    const Coords = findVertexCoord(count, x, y);
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
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            for (let k = 0; k < matrix[0].length; k++) {
                if (matrix[k][arr[i][j]] === 1 && arr[i][j] !== k) {
                    for (let h = 0; h < arr.length; h++) {
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

    for (let i = 0; i < val.start.length; i++){
        if (checkRepeat(val, i)){
            const angle = calculateAngle(CondCoords, val.start[i], val.end[i]);
            const valid = lineVal(CondCoords, val.start[i],  val.end[i], radius);
            if (valid !== null){
                drawEllipse(CondCoords, val.start[i],  val.end[i], angle, ctx, radius);
                arrow(CondCoords, val.end[i], angle, radius, ctx, 1);
            }
            else{
                drawLine(CondCoords, val.start[i],  val.end[i], ctx);
                arrow(CondCoords, val.end[i], angle, radius, ctx);
            }
        }
    }
    Object.entries(obj).forEach(() => {
        drawCondVertex(CondCoords, pointer, radius, ctx);
        pointer++;
    });
}

export {drawVertexes, drawUndirMatrixEdges, drawCondGraph, drawDirMatrixEdges}