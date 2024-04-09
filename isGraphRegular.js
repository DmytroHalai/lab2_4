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

export {checkGraphRegular};