function(instance, properties, context) {

    instance.data[`${properties.table_name}`] = {};
    instance.data[`${properties.table_name}`].tableBody = [];
    instance.data[`${properties.table_name}`].arrayOfWidths = [];
    instance.data[`${properties.table_name}`].arrayOfHeaders = [];


}