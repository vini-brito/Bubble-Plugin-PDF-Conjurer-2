function(properties, context) {

  const { prev_configs, repeating_structure_name, table_name, header_style, place_headers } = properties;

  const configs = JSON.parse(prev_configs);

  configs.repeatedTables[table_name] = [];

  const configurations = JSON.stringify(configs);

  return { configurations };

}