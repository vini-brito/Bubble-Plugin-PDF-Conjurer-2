function(properties, context) {

        const { 
            prev_configs, 
            table_name, 
            items_list, 
            using_images, 
            text_body_style, 
            column_width, 
            specified_column_width,
            column_header,
            header_style,
            image_width,
            image_height,
            custom_margins,
            left_margin,
            top_margin,
            right_margin,
            bottom_margin,
            parse_bbcode,
        } = properties;
        
        const crypto = require('crypto');
        const fetch = require('node-fetch');
        
        function generateRandomBytes(number) {
            return crypto.randomBytes(number).toString('hex');
        }
        
        const configs = JSON.parse(prev_configs);
        
        const fonts = { ...configs.defaultFonts, ...configs.addedFonts };
        
        const parserURL = 'https://meta-l.cdn.bubble.io/f1688082896800x500622453357242560/bbcodeparser_fixedcode_v5_SS.js';
        
        const parser = context.async((callback) => {
        fetch(parserURL)
            .then((response) => response.text())
            .then((file) => {
            eval(file);
                
            callback(null, getParser(
                fonts, 
                (imageName, link) => {
                configs.addedImages[imageName] = link;
                }, 
                (err) => {
                console.error(err);
                }, 
                'code', 
                'quote'
            ));
            })
            .catch((err) => {
            callback(err, null);
            });
        });
        
        const columnWidths = {
            'Fit available space': '*',
            'Fit content': 'auto',
            'Fixed width': specified_column_width
        }
        
        // Configure options
        
        const bodyOptions = {};
        const headerOptions = {};
        
        if (text_body_style) bodyOptions.style = text_body_style;
        if (using_images && image_width) bodyOptions.width = image_width;
        if (using_images && image_height) bodyOptions.height = image_height;
        
        if (header_style) headerOptions.style = header_style;
        
        if (custom_margins) {
            const margin = [left_margin, top_margin, right_margin, bottom_margin];
            bodyOptions.margin = margin;
            headerOptions.margin = margin;
        }    
    
        // Configure table
        
        if (configs.advancedTables[table_name]) {
            // Add Column width
            const width = columnWidths[column_width] || 'auto';
            configs.advancedTables[table_name].widths.push(width);
            
            // Parse BBCode Header
            const headerText = column_header || '';
            const headerKey = parse_bbcode ? 'stack': 'text';
            const headerContent = parse_bbcode ? parser.getParsedText(headerText) : headerText;
            
            // Add Column header
            const header = { [headerKey]: headerContent, ...headerOptions };
            
            configs.advancedTables[table_name].headers.push(header);
            
            // Add contents
            let itemsList;
            
            if (items_list === null) {

                itemsList = [];

            } else {

                itemsList = items_list.get(0, items_list.length());
            }



            
            if (!using_images) {
                // Text elements
                const textObjects = itemsList.map((text) => {
                    if (parse_bbcode) {
                        return { stack: parser.getParsedText(text), ...bodyOptions };
                    }
                    return { text, ...bodyOptions };
                });
                
                configs.advancedTables[table_name].columns.push(textObjects);
            } else {
                // Image elements
                const imageObjects = itemsList.map((img) => {
                    const imageName = 'image' + generateRandomBytes(8);
                    
                    configs.addedImages[imageName] = img;
                    
                    return { image: imageName, ...bodyOptions };
                });
                
                configs.advancedTables[table_name].columns.push(imageObjects);
            }    
        } else {
            throw new Error(`It wasn't possible to find the table name ${table_name}`);
        }
        
        const configurations = JSON.stringify(configs);

        return { configurations };

    }