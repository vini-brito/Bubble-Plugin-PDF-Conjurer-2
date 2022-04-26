function(instance, properties, context) {

    const getList = (thingWithList, startPosition, finishPosition) => {
        let returnedList = thingWithList.get(startPosition, finishPosition);
        return returnedList;
    }


    const layoutHashmap = {

        "Fit available space": "*",
        "Fit content": "auto", 
        "Fixed width": properties.specified_column_width,

    }

    var columnWidth = layoutHashmap[properties.column_width];

    const customMarginsDefinitionLogic = () => {

        if (properties.custom_margins === true) {

            return [properties.left_margin, properties.top_margin, properties.right_margin, properties.bottom_margin];

        } else {

            return null;

        }

    }

    if (properties.using_images) {
        // flow for image column

        const protocolFix = (possibleUrl) => {

            if (possibleUrl.substring(0, 4) === "http") {

                return possibleUrl;

            } else {

                return `https:${possibleUrl}`;

            }

        };

        let currentList;

        if (properties.list_of_items === null) {

            currentList = [];

        } else {

            currentList = getList(properties.list_of_items, 0, properties.list_of_items.length());
        }

        const turnUrlIntoImageObject = (url) => {

            let fixedImageUrl = protocolFix(url);

            let providedImageName = protocolFix(url).replaceAll(/\W/g, '');

            instance.data.docDefinition.images[`${providedImageName}`] = fixedImageUrl;

            if (typeof properties.image_width === "undefined") {
                properties.image_width = "";
            }

            if (typeof properties.image_height === "undefined") {
                properties.image_height = "";
            }

            let imageObjectHolder = {

                image: providedImageName,
                width: properties.image_width,
                height: properties.image_height,
                margin: customMarginsDefinitionLogic(),

            };
        
            return imageObjectHolder;

        }


        let imageObjectsList = currentList.map(turnUrlIntoImageObject);

        instance.data[`${properties.table_name}`].tableBody.push(imageObjectsList);

        instance.data[`${properties.table_name}`].arrayOfWidths.push(columnWidth);


        if (typeof properties.column_header !== "undefined" && properties.column_header !== null) {

            let columnHeaderAsObj = { text: properties.column_header, style: properties.header_style };

            instance.data[`${properties.table_name}`].arrayOfHeaders.push(columnHeaderAsObj);

        } else {

            let columnHeaderAsObj = { text: "", style: "" };

            instance.data[`${properties.table_name}`].arrayOfHeaders.push(columnHeaderAsObj);

        }

    } else {
        // normal flow

        const turnStringIntoTextObject = (string) => {
            
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
                
                return {
                    stack: parser.getParsedText(string),
                    style: properties.text_body_style,
                    margin: customMarginsDefinitionLogic()
                }
            }

            return {

                text: string,
                style: properties.text_body_style,
                margin: customMarginsDefinitionLogic(),

            }


        };

        let currentList;
        
        if (properties.list_of_items === null) {

            currentList = [];

        } else {

            currentList = getList(properties.list_of_items, 0, properties.list_of_items.length());
        }


        let textObjectsList = currentList.map(turnStringIntoTextObject);

        instance.data[`${properties.table_name}`].tableBody.push(textObjectsList);

        instance.data[`${properties.table_name}`].arrayOfWidths.push(columnWidth);


        if (typeof properties.column_header !== "undefined" && properties.column_header !== null) {

            let columnHeaderAsObj = { text: properties.column_header, style: properties.header_style };
            
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
                
                columnHeaderAsObj = { stack: parser.getParsedText(properties.column_header), style: properties.header_style };
            }

            instance.data[`${properties.table_name}`].arrayOfHeaders.push(columnHeaderAsObj);

        } else {

            let columnHeaderAsObj = { text: "", style: "" };

            instance.data[`${properties.table_name}`].arrayOfHeaders.push(columnHeaderAsObj);

        }

    }

}