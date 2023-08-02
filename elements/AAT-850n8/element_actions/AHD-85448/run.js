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

    var layoutHolder = selectLayout(properties.table_layout);

    let storedListLengths = instance.data[`${properties.table_name}`].tableBody.map(returnLength);

    instance.data.biggestLength = storedListLengths.reduce(biggerComparer);

    instance.data.indexOfLongerArray = storedListLengths.findIndex(isThisTheBiggestLength);

    // here we transpose the table to fit pdfmake's table structure of array
    let tableBodyTransposed = transpose(instance.data[`${properties.table_name}`].tableBody);

    instance.data[`${properties.table_name}`].tableBody = tableBodyTransposed.map(createBlanks);



    // now let's put the headers so they become the first row. This is after the transposition, because we want it to not be transposed so it stays a row and doesn't becomes a column

    // first check if headers are all empty objects

    const isBlankHeader = (element) => element.text === "" && element.style === "";

    let areAllHeadersBlank = instance.data[`${properties.table_name}`].arrayOfHeaders.every(isBlankHeader);

    if (!areAllHeadersBlank) {

        var useHeaderRow = 1; // this will make the first row be repeated in the other pages the table also extends to.

        instance.data[`${properties.table_name}`].tableBody.unshift(instance.data[`${properties.table_name}`].arrayOfHeaders);

    } else {

        var useHeaderRow = 0; // in case a header row isn't used, this won't make the first row be repeated on other pages that the table may extend to.

    }

    let tableObjectHolder = {
        table: {
            headerRows: useHeaderRow,
            dontBreakRows: true,
            keepWithHeaderRows: useHeaderRow,
            widths: instance.data[`${properties.table_name}`].arrayOfWidths,
            body: instance.data[`${properties.table_name}`].tableBody,
        },
        margin: tableCustomMarginsDefinitionLogic(),
        layout: layoutHolder,
        pageBreak: properties.page_break.toLowerCase(),
    };


    // here, in case this is being inputted into a multi column, will add the width of this element's column then push it into the specified column.

    if (properties.into_multi_column === true) {

        /* 		if (properties.this_column_width === "Fit available space") {
                    tableObjectHolder.width = "*";
                } else {
                    tableObjectHolder.width = "auto";
                } */

        if (properties.this_column_width === "Fit available space") {

            tableObjectHolder.width = "*";

        } else if (properties.this_column_width === "Fit content") {

            tableObjectHolder.width = "auto";

        } else if (properties.this_column_width === "Fixed width") {

            tableObjectHolder.width = properties.fixed_width_column_size;

        }

        // pushing into the multi column
        instance.data.multiColumnObjectHolder[`${properties.multi_column_name}`].columns.push(tableObjectHolder);

    } else if (properties.into_footer === true) {

        // here we push it into the footer
        instance.data.footerObjectsHolder.columns.push(tableObjectHolder);

    } else if (properties.into_header === true) {

        // here we push it into the header
        instance.data.headerObjectsHolder.columns.push(tableObjectHolder);

    } else if (properties.into_background === true) {

        // here we push it into the background
        instance.data.docDefinition.background.push(tableObjectHolder);

    } else {
        // here we push the object into the main document body

        instance.data.composeInMe.push(tableObjectHolder);
    }



}