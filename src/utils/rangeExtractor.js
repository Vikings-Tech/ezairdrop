const rangeExtractor = (rawText = "", elements = []) => {
    const individualElements = rawText.split(",")
    const finalRangeElements = []
    individualElements.map((element) => {
        let rawElement = element.split("-");
        let isNan = false
        rawElement = rawElement.map(e => {
            if (isNaN(parseInt(e))) {
                isNan = true;
            }
            return parseInt(e)
        });

        if (rawElement.length < 1 || isNan) {
            return;
        }
        else if (rawElement.length === 1) {
            finalRangeElements.push(parseInt(rawElement[0]));
        }
        else if (rawElement.length === 2 && rawElement[0] <= rawElement[1]) {
            for (let i = rawElement[0]; i <= rawElement[1]; i++) {
                finalRangeElements.push(i);
            }
        }
    })
    const userRange = [... new Set(finalRangeElements)]
    const intersection = userRange.filter(element => elements.includes(element));

    return intersection;

}
// console.log(rangeExtractor("1,,2---,,9asdf5,6,7,8,9,", [11, 23, 4, 22, 5, 2, 6]))
export default rangeExtractor