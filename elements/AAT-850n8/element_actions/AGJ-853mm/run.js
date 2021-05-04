function(instance, properties, context) {


        // [["A", "A", "A", "A"], ["B", "B", "B", "B"], ["C", "C", "C", "C"]]
        let sequentiallyRepeatedElements = instance.data.repeatingStructureObjectsHolder[`${properties.repeating_structure_name}`].elements;

        //console.log("Sequentially is", sequentiallyRepeatedElements)

        let returnLength = (element) => {
            return element.length;
        }

        let biggerComparer = (accumulator, currentValue) => {
            let biggerNumber;
            if (accumulator > currentValue) {
                biggerNumber = accumulator;
            } else {
                biggerNumber = currentValue;
            }
            return biggerNumber;
        }

        let isThisTheBiggestLength = (element, index, array) => {
            if (element === biggestLength) {
                return true
            } else {
                return false
            }
        }

        let storedListLengths = sequentiallyRepeatedElements.map(returnLength);

        let biggestLength = storedListLengths.reduce(biggerComparer);

        let indexOfLongerArray = storedListLengths.findIndex(isThisTheBiggestLength);

        // a transpose function
        let transpose = (a) => {

            // Calculate the width and height of the Array
            var w = a.length || 0;
            var h = a[indexOfLongerArray] instanceof Array ? a[indexOfLongerArray].length : 0;

            /*// In case it is a zero matrix, no transpose routine needed.
            if (h === 0 || w === 0) {
                return [];
            }*/

            /**
             * @var {Number} i Counter
             * @var {Number} j Counter
             * @var {Array} t Transposed data is stored in this array.
             */
            var i, j, t = [];

            // Loop through every item in the outer array (height)
            for (i = 0; i < h; i++) {

                // Insert a new row (array)
                t[i] = [];

                // Loop through every item per item in outer array (width)
                for (j = 0; j < w; j++) {

                    // Save transposed data.
                    t[i][j] = a[j][i];
                }
            }

            return t;
        }


        // here we transpose the elements to mix them
        // Result is [["A", "B", "C"], ["A", "B", "C"], ["A", "B", "C"], ["A", "B", "C"]]

        let mixedSeriesOfElements = transpose(sequentiallyRepeatedElements);

       // console.log("Mixed series is", mixedSeriesOfElements)

        // now to flat that array so it fits PDFmake's one element on top of the other structure

        let flattenedMixedSeries = mixedSeriesOfElements.flat(2);

       // console.log("Flattened mixed series is", flattenedMixedSeries)

        // now everything goes in order into 

        // wherever the bubbler wants to

        letFilteredUndefinedsFlatMixSeries = flattenedMixedSeries.filter(Boolean);

        let renewedObjsFlatMixSeries = letFilteredUndefinedsFlatMixSeries.map(x => JSON.parse(JSON.stringify(x)));

        instance.data.composeInMe.push(...renewedObjsFlatMixSeries)



}