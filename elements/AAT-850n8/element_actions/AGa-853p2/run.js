function(instance, properties, context) {


    let itemsNumbers = instance.data.repeatingStructureObjectsHolder[`${properties.repeating_structure_name}`].howManyIterations;

    // the body property is an array that will hold other arrays that will be turned into rows.
    instance.data[`${properties.table_name}`] = {};

    instance.data[`${properties.table_name}`].tableBodies = [];
    instance.data[`${properties.table_name}`].arraysOfWidths = [];

    instance.data[`${properties.table_name}`].arrayOfHeaders = [];

    if (typeof properties.header_style !== "undefined" && properties.header_style !== null) {

        instance.data[`${properties.table_name}`].definedStyleForHeaderText = properties.header_style.replaceAll(/\W/g, ''); // small regex to remove any undesirable characters from style name inputed by app maker

    } else {

        instance.data[`${properties.table_name}`].definedStyleForHeaderText = "";

    }


    for (i = 0; i < itemsNumbers; i++) {

        instance.data[`${properties.table_name}`].tableBodies.push([]);
        instance.data[`${properties.table_name}`].arraysOfWidths.push([]);

    }




}