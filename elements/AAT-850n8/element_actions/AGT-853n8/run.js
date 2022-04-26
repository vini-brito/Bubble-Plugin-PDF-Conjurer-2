function(instance, properties, context) {
   
    const getList = (thingWithList, startPosition, finishPosition) => {
        let returnedList = thingWithList.get(startPosition, finishPosition);
        return returnedList;
    }

    let itemsNumbers = instance.data.repeatingStructureObjectsHolder[`${properties.repeating_structure_name}`].howManyIterations;

    var tempColumnHolder = [];



    for (i = 0; i < itemsNumbers; i++) {

        let storedCurrentListThing = getList(properties[`data_source`], 0, properties[`data_source`].length())[i].get(properties.field_of_thing);

        let currentList = getList(storedCurrentListThing, 0, storedCurrentListThing.length());
        
        if (properties.parse_bbcode) {
            const parser = getParser(
            	pdfMake.fonts, 
            	(imageName, link) => {
                	instance.data.docDefinition.images[imageName] = link;
            	}, 
            	(err) => {
                	context.reportDebugger(err.message);
            	}
        	);
            
            currentList = currentList.map((item) => {
                return { stack: parser.getParsedText(item) };
            });
        }

        tempColumnHolder.push(currentList);

    }


    for (i = 0; i < itemsNumbers; i++) {

        instance.data[`${properties.table_name}`].tableBodies[i].push(tempColumnHolder[i]);

        if (properties.table_column_width === "Fit available space") {
            var columnsWidth = "*";
        } else {
            var columnsWidth = "auto";
        }

        instance.data[`${properties.table_name}`].arraysOfWidths[i].push(columnsWidth);

    }



    if (typeof properties.column_header !== "undefined" && properties.column_header !== null) {

        let columnHeaderAsObj = { text: properties.column_header, style: instance.data[`${properties.table_name}`].definedStyleForHeaderText };
        
        if (properties.parse_bbcode) {
            const parser = getParser(
            	pdfMake.fonts, 
            	(imageName, link) => {
            		instance.data.docDefinition.images[imageName] = link;
            	}, 
            	(err) => {
            		context.reportDebugger(err.message);
            	}
        	);
            
            columnHeaderAsObj = { stack: parser.getParsedText(properties.column_header), style: instance.data[`${properties.table_name}`].definedStyleForHeaderText }
        }

        instance.data[`${properties.table_name}`].arrayOfHeaders.push(columnHeaderAsObj);

    }

}