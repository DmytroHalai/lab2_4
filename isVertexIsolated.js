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

export {isolAndHangingVertexes};