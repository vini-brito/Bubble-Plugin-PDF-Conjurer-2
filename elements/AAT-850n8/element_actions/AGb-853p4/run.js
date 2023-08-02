function(instance, properties, context) {

    let selectLayout = (chosenLayout) => {
        if (chosenLayout === "No Borders") {
            return "noBorders";
        }
        else if (chosenLayout === "Header Line Only") {
            return "headerLineOnly";
        }
        else if (chosenLayout === "Light Horizontal Lines") {
            return "lightHorizontalLines";
        }
        else if (chosenLayout === "Strong Outer Border") {
            return {
                hLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? 2 : 1;
                },
                vLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                },
                hLineColor: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                },
                vLineColor: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                }
            }
        }
        else if (chosenLayout === "Zebra") {
            return {
                fillColor: function (i, node) {
                    return (i % 2 === 0) ? '#CCCCCC' : null;
                }
            }
        } else if (chosenLayout === "Light Horizontal Lines Without Header") {

			return {
				hLineWidth(i, node) {
					return (i === node.table.headerRows) ? 0 : 1; // Set the header row to 2, others to 1
				},
				vLineWidth(i) {
					return 0; // No vertical lines
				},
				hLineColor(i) {
					return '#aaa'; // Customize the color of horizontal lines
				},
				paddingLeft(i) {
					return i === 0 ? 0 : 8; // Add padding to the left of the content cells
				},
				paddingRight(i, node) {
					return (i === node.table.widths.length - 1) ? 0 : 8; // Add padding to the right of the content cells
				}
			}

		}
        else {
            return "no layout specified"
        }

    }

    let tableCustomMarginsDefinitionLogic = () => {
        if (properties.table_custom_margins === true) {
            return [properties.table_left_margin, properties.table_top_margin, properties.table_right_margin, properties.table_bottom_margin];
        } else { return null; } // function to allow to set custom margins or ignore it and use default ones
    }

    // auxiliary functions for the transposition incoming!

    // transform "undefined" array elements created by the transposition function into null elements so pdfmake works fine with them (undefined causes crashes)
    let createBlanks = (element) => {
        let checkAndSwap = (nestedElement) => {
            if (nestedElement === undefined) {
                return null;
            } else {
                return nestedElement
            }
        }
        return element.map(checkAndSwap);
    }

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
        if (element === instance.data.biggestLength) {
            return true
        } else {
            return false
        }
    }



    // a transpose function
    let transpose = (a) => {

        // Calculate the width and height of the Array
        var w = a.length || 0;
        var h = a[instance.data.indexOfLongerArray] instanceof Array ? a[instance.data.indexOfLongerArray].length : 0;

        // In case it is a zero matrix, no transpose routine needed.
        if (h === 0 || w === 0) { return []; }

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
    // remove this when text style becomes defined at individual column
    if (typeof properties.tableStyle !== "undefined" && properties.tableStyle !== null) {

        var definedStyleForTable = properties.tableStyle.replaceAll(/\W/g, ''); // small regex to remove any undesirable characters from style name inputed by app maker

    } else {

        var definedStyleForTable = "";

    }

    var itemsNumbers = instance.data.repeatingStructureObjectsHolder[`${properties.repeating_structure_name}`].howManyIterations;

    var layoutHolder = selectLayout(properties.table_layout);

    let thisElementSeries = [];

    for (i = 0; i < itemsNumbers; i++) {

        // here we fill in blank elements to the table so it becomes a square matrix and doesn't crashes (pdfmake only likes square matrices!

        let storedListLengths = instance.data[`${properties.table_name}`].tableBodies[i].map(returnLength);

        instance.data.biggestLength = storedListLengths.reduce(biggerComparer);

        instance.data.indexOfLongerArray = storedListLengths.findIndex(isThisTheBiggestLength);

        // here we transpose the table to fit pdfmake's table structure of array
        let tableBodiesTransposed = transpose(instance.data[`${properties.table_name}`].tableBodies[i]);

        instance.data[`${properties.table_name}`].tableBodies[i] = tableBodiesTransposed.map(createBlanks);

        // now let's put the headers so they become the first row. This is after the transposition, because we want it to not be transposed so it stays a row and doesn't becomes a column

        if (instance.data[`${properties.table_name}`].arrayOfHeaders.length !== 0) {

            var useHeaderRow = 1; // this will make the first row be repeated in the other pages the table also extends to.

            let currentClonedArray = [];

            for (j = 0; j < instance.data[`${properties.table_name}`].arrayOfHeaders.length; j++) {

                let currentObj = JSON.parse(JSON.stringify(instance.data[`${properties.table_name}`].arrayOfHeaders[j]));
                currentClonedArray.push(currentObj);

            }

            instance.data[`${properties.table_name}`].tableBodies[i].unshift(currentClonedArray);


        } else {

            var useHeaderRow = 0; // in case a header row isn't used, this won't make the first row be repeated on other pages that the table may extend to.

        }


        let tableObjectHolder = {
            table: {
                headerRows: useHeaderRow,
                widths: instance.data[`${properties.table_name}`].arraysOfWidths[i],
                body: instance.data[`${properties.table_name}`].tableBodies[i],
            },
            style: `${definedStyleForTable.toLowerCase()}`,
            margin: tableCustomMarginsDefinitionLogic(),
            layout: layoutHolder,
            pageBreak: properties.page_break.toLowerCase(),
        };

        // here we push the object into the intermediary array so in another action after this one it gets pushed into the main elements body

        // being inserted into a repeated multi column
        if (properties.into_multi_column === true) {

            instance.data.repeatingStructureObjectsHolder[`${properties.repeating_structure_name}`][`${properties.multi_column_name}`][i].columns.push(tableObjectHolder)

        } else {

            thisElementSeries.push(tableObjectHolder)

        }
    }

    if (properties.into_multi_column === false) {

        instance.data.repeatingStructureObjectsHolder[`${properties.repeating_structure_name}`].elements.push(thisElementSeries)

    }

}