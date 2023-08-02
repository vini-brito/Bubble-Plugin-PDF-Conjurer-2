function(properties, context) {

    const {
        prev_configs,
        table_name,
        repeating_structure_name,
        custom_margins,
        left_margin,
        top_margin,
        right_margin,
        bottom_margin,
        page_break,
        table_layout,
        into_multi_column,
        multi_column_name,
        multi_column_width,
    } = properties;

    const configs = JSON.parse(prev_configs);

    const { [table_name]: repeatedTable } = configs.repeatedTables;

    if (!repeatedTable) throw new Error(`It wasn't possible to find the table name ${table_name}`);

    const tableLayouts = {
        'No Borders': 'noBorders',
        'Header Line Only': 'headerLineOnly',
        'Light Horizontal Lines': 'lightHorizontalLines',
        'Strong Outer Border': 'strongOuterBorder',
        'Zebra': 'zebra',
        'Light Horizontal Lines Without Header': 'lightHorizontalLinesWithoutHeader'
    }

    const options = {};

    if (custom_margins) options.margin = [left_margin, top_margin, right_margin, bottom_margin];
    if (page_break !== 'Unspecified') options.pageBreak = page_break.toLowerCase();
    if (table_layout !== 'Standard') options.layout = tableLayouts[table_layout];

    //if (into_multi_column) options.width = multi_column_width === 'Fit available space' ? '*' : 'auto';

    if (into_multi_column) {


        if (multi_column_width === 'Fit available space') {

            options.width = "*";

        } else if (multi_column_width === "Fit content") {

            options.width = "auto";

        } else if (multi_column_width === "Fixed width") {

            options.width = fixed_width_column_size;

        }

    }



    const tables = repeatedTable.map((tableConfigs) => {
        const { columns, headers, widths } = tableConfigs;

        const headerRows = 1;

        const body = [headers];

        const numberOfLines = columns.map((line) => line.length || 0);
        const maxNumberOfLines = Math.max(...numberOfLines);

        for (let i = 0; i < maxNumberOfLines; i++) {
            const line = columns.map((value) => {
                return value[i] || '';
            });

            body.push(line);
        }

        const table = { headerRows, widths, body };

        return { table, ...options };
    });

    if (into_multi_column) {
        if (!multi_column_name) {
            throw new Error('Please insert the multi column name');
        }

        if (!configs.repeatedColumns[multi_column_name]) {
            throw new Error(`It wasn't possible to find the multi column name ${multi_column_name}`);
        }

        configs.repeatedColumns[multi_column_name].forEach((column, index) => {
            const table = tables[index];

            if (table) column.columns.push(table);
        });
    } else {
        if (!configs.repeatedStructures[repeating_structure_name]) {
            throw new Error(`It wasn't possible to find the repeating structure name ${repeating_structure_name}`);
        }

        configs.repeatedStructures[repeating_structure_name].forEach((structure, index) => {
            const table = tables[index];

            if (table) structure.push(table);
        });
    }

    const configurations = JSON.stringify(configs);

    return { configurations };

}