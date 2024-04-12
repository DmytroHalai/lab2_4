'use strict'

import {createDirMatrix, undirMatrix, squareMatrix, cubeMatrix, strongMatrix, reachMatrix,
        convertMatrixToString} from "./matrix.js";
import {k1, k2} from "./utility.js";
import {drawUndirMatrixEdges, drawVertexes, drawCondGraph, drawDirMatrixEdges} from "./drawGraphs.js";
import {matrixOutput, printMatrix, printStrongMatrix, printReachMatrix, componentsOutput} from "./output.js";
import {findDirMatrixPower, findDirMatrixEnterPower, findUndirMatrixPower, findDirMatrixExitPower} from "./power.js";
import {checkGraphRegular} from "./isGraphRegular.js";
import {isolAndHangingVertexes} from "./isVertexIsolated.js";
import {findComponents} from "./components.js";
import {findPrintWay2, findPrintWays3} from "./ways.js";

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const VERTEX_COUNT = 10;
const VERTEX_RADIUS = 15;
const N = 3105;

const matrix = createDirMatrix(N, k1)
const undMatrix = undirMatrix(createDirMatrix(N, k1));
drawUndirMatrixEdges(300, 180, N, ctx, VERTEX_RADIUS, VERTEX_COUNT, k1);
drawDirMatrixEdges(800, 180, N, ctx, VERTEX_RADIUS, VERTEX_COUNT, k1);
drawVertexes(ctx, VERTEX_COUNT, 300, 180, VERTEX_RADIUS);
drawVertexes(ctx, VERTEX_COUNT, 800, 180, VERTEX_RADIUS);
matrixOutput(matrix, "dirMatrixTable");
matrixOutput(undMatrix, "undirMatrixTable")


const dirPow = findDirMatrixPower(matrix);
findUndirMatrixPower(undMatrix);
findDirMatrixEnterPower(matrix);
findDirMatrixExitPower(matrix);
checkGraphRegular(matrix, dirPow);
isolAndHangingVertexes(dirPow);

const matrix2 = createDirMatrix(N, k2)
console.log("Start of printing matrix2>>>");
printMatrix(matrix2);
console.log("<<<End of printing matrix2");
console.log('\n');

drawDirMatrixEdges(300, 600, N, ctx, VERTEX_RADIUS, VERTEX_COUNT, k2);
drawVertexes(ctx, VERTEX_COUNT, 300, 600, VERTEX_RADIUS);
const dirPow2 = findDirMatrixPower(matrix2);
findDirMatrixEnterPower(matrix2);
findDirMatrixExitPower(matrix2);
checkGraphRegular(matrix2, dirPow2);
isolAndHangingVertexes(dirPow2);
const res = squareMatrix(matrix2);
const res2 = cubeMatrix(matrix2);

findPrintWay2(matrix2, res);
findPrintWays3(matrix2, res2);
printReachMatrix(matrix2);
printStrongMatrix(reachMatrix(matrix2));
const cond = findComponents(convertMatrixToString(strongMatrix(reachMatrix(matrix2))));
componentsOutput(cond);
drawCondGraph(matrix2, cond, 800, 600, VERTEX_COUNT, VERTEX_RADIUS, ctx);