import {reachMatrix, strongMatrix} from "./matrix.js";

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

const printMatrix = (matrix, joiner= ', ') => {
    console.group("matrix")
    matrix.forEach((row, index) => {
        console.log(`${index + 1}) ` + row.join(joiner));
    });
    console.groupEnd();

}

const printReachMatrix = (matrix) => {
    console.group("Start of printing reachability matrix>>>");
    printMatrix(reachMatrix(matrix));
    console.log("<<<End of printing reachability matrix");
    console.groupEnd();
    console.log('\n');
}

const printStrongMatrix = (matrix) => {
    console.group("Start of printing strong connectivity matrix>>>");
    printMatrix(strongMatrix(matrix));
    console.log("<<<End of printing strong connectivity matrix");
    console.groupEnd();
    console.log('\n');
}

const componentsOutput = (object) => {
    let arr = [];
    Object.entries(object).forEach(([, value]) => {
        arr.push(value.map((value) => parseInt(value)));
    });
    arr.forEach((arr) => console.log(`Components of strong connectivity are: {${arr.map(value => value + 1).join(', ')}}`))
}

export {matrixOutput, componentsOutput, printMatrix, printReachMatrix, printStrongMatrix};