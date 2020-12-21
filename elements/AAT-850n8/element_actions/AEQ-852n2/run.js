function(instance, properties, context) {


    // composeInMe is an array of objects and we push a new object into it, each object is an element created in the pdf


    // here we bring it into existence if it doesn't exists yet

    if (instance.data.composeInMe === undefined) {
        instance.data.composeInMe = [];
    }

    const getList = (thingWithList, startPosition, finishPosition) => {
        let returnedList = thingWithList.get(startPosition, finishPosition);
        return returnedList;
    }

    const imgCustomMarginsDefinitionLogic = () => {
        if (properties.image_custom_margins === true) {
            return [properties.left_margin, properties.top_margin, properties.right_margin, properties.bottom_margin];
        } else { return null; } // function to allow to set custom margins or ignore it and use default ones
    }

    if (
        typeof properties.image_link !== "undefined" &&
        properties.image_link &&
        (typeof properties.repeating_structure_name === "undefined" || properties.repeating_structure_name === null)
    ) {

        let fixedImageUrl = `https:${properties.image_link}`; // because bubble doesn't passes the protocol, only the link, so we append the protocol ourselves

        let providedImageName = properties.image_link.replaceAll(/\W/g, ''); // small regex to remove any undesirable characters from style name inputed by app maker


        instance.data.docDefinition.images[`${providedImageName}`] = fixedImageUrl;


        // here we capture whatever the user (app maker) has inputed into the workflow actions into an object

        if (properties.image_width === undefined) {
            properties.image_width = "";
        }

        if (properties.image_height === undefined) {
            properties.image_height = "";
        }



        let imageObjectHolder = {
            image: providedImageName,
            pageBreak: properties.page_break.toLowerCase(),
            width: properties.image_width,
            height: properties.image_height,
            margin: imgCustomMarginsDefinitionLogic(),
        };


        // here, in case this is being inputted into a multi column, will add the width of this element's column then push it into the specified column.

        if (properties.into_multi_column === true) {

            // pushing into the multi column
            instance.data.multiColumnObjectHolder[`${properties.multi_column_name}`].columns.push(imageObjectHolder);

        } else if (properties.into_footer === true) {

            // here we push it into the footer
            instance.data.footerObjectsHolder.columns.push(imageObjectHolder);

        } else if (properties.into_header === true) {

            // here we push it into the header
            instance.data.headerObjectsHolder.columns.push(imageObjectHolder);

        } else if (properties.into_background === true) {

            // here we push it into the background
            instance.data.docDefinition.background.push(imageObjectHolder);

        } else {
            // here we push the object into the main document body

            instance.data.composeInMe.push(imageObjectHolder);
        }

    } else if (typeof properties.repeating_structure_name !== "undefined" && properties.repeating_structure_name) {


        // repeating structure flow
        if (typeof properties.image_list !== "undefined" && properties.image_list) {

            let listOfImages = getList(properties[`image_list`], 0, properties[`image_list`].length());

            let thisElementSeries = [];

            for (i = 0; i < instance.data.repeatingStructureObjectsHolder[`${properties.repeating_structure_name}`].howManyIterations; i++) {


                let fixedImageUrl = `https:${listOfImages[i]}`; // because bubble doesn't passes the protocol, only the link, so we append the protocol ourselves

                let providedImageName = `https:${listOfImages[i]}`.replaceAll(/\W/g, ''); // small regex to remove any undesirable characters from style name inputed by app maker

                instance.data.docDefinition.images[`${providedImageName}`] = fixedImageUrl;


                let currentImageObjectHolder = {
                    image: providedImageName,
                    pageBreak: properties.page_break.toLowerCase(),
                    width: properties.image_width,
                    height: properties.image_height,
                    margin: imgCustomMarginsDefinitionLogic(),
                };


                // being inserted into a repeated multi column
                if (properties.into_multi_column === true) {

                    instance.data.repeatingStructureObjectsHolder[`${properties.repeating_structure_name}`][`${properties.multi_column_name}`][i].columns.push(currentImageObjectHolder)

                } else {

                    thisElementSeries.push(currentImageObjectHolder)

                }

            }

            if (properties.into_multi_column === false) {

                instance.data.repeatingStructureObjectsHolder[`${properties.repeating_structure_name}`].elements.push(thisElementSeries)

            }

        } else {

            let fixedImageUrl = `https:${properties.image_link}`; // because bubble doesn't passes the protocol, only the link, so we append the protocol ourselves

            let providedImageName = properties.image_link.replaceAll(/\W/g, ''); // small regex to remove any undesirable characters from style name inputed by app maker

            instance.data.docDefinition.images[`${providedImageName}`] = fixedImageUrl;

            let thisElementSeries = [];

            for (i = 0; i < instance.data.repeatingStructureObjectsHolder[`${properties.repeating_structure_name}`].howManyIterations; i++) {

                let currentImageObjectHolder = {
                    image: providedImageName,
                    pageBreak: properties.page_break.toLowerCase(),
                    width: properties.image_width,
                    height: properties.image_height,
                    margin: imgCustomMarginsDefinitionLogic(),
                };

                // being inserted into a repeated multi column
                if (properties.into_multi_column === true) {

                    instance.data.repeatingStructureObjectsHolder[`${properties.repeating_structure_name}`][`${properties.multi_column_name}`][i].columns.push(currentImageObjectHolder)

                } else {

                    thisElementSeries.push(currentImageObjectHolder)

                }
            }
            
            if (properties.into_multi_column === false) {

                instance.data.repeatingStructureObjectsHolder[`${properties.repeating_structure_name}`].elements.push(thisElementSeries)

            }

        }



    }








}