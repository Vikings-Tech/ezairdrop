const floatExtractor = (rawText = "") => {
    const individualElements = rawText.split(",")
    const finalRangeElements = []
    individualElements.map((element) => {
        if(!isNaN(element)&& element.trim()!=""){
            finalRangeElements.push(element);
        }
       
    })
   
    return finalRangeElements;

}
// console.log(rangeExtractor("1,,2---,,9asdf5,6,7,8,9,", [11, 23, 4, 22, 5, 2, 6]))
export default floatExtractor