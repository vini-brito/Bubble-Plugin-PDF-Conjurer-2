function(properties, context) {
	
    const crypto = require('crypto');
   	
	const { 
        prev_configs, 
        image_name, 
        width, 
        height, 
        have_used_before, 
        image,
        custom_margins,
        margin_left,
        margin_top,
        margin_right,
        margin_bottom,
        page_break,
        into_footer,
        into_header,
        into_multi_column,
        multi_column_name,
        column_width,
        alignment,
        into_background,
        repeating_structure_name,
        image_list,
    } = properties;
    
    const configs = JSON.parse(prev_configs);
    
    // Helpers
    
    const willBeInsertedIntoColumn =  into_header || into_footer || into_multi_column;
    
    function generateRandomBytes(length) {
        return crypto.randomBytes(length).toString('hex');
    }
    
    function parseImageList(img, options) { 
    	const imageName = image_name + generateRandomBytes(8);
                
        configs.addedImages[imageName] = img;
        
        const imageItem = { image: imageName, ...options }
                
        return willBeInsertedIntoColumn 
            ? { stack: [imageItem], width: column_width === 'Fit available space' ? '*' : 'auto' } 
        	: imageItem;
    }
    
    const options = {};
  
    if (width) options.width = width;
    if (height) options.height = height;
    if (custom_margins) options.margin = [margin_left, margin_top, margin_right, margin_bottom];
    if (page_break !== 'Unspecified') options.pageBreak = page_break.toLowerCase();
    if (alignment) options.alignment = alignment.toLowerCase();
    
    let imageObject = { image: image_name, ...options };
    
    
    
    if (willBeInsertedIntoColumn) {
        imageObject = {
            stack: [imageObject],
            width: column_width === 'Fit available space' ? '*' : 'auto',
        }
    }
    
    if (!repeating_structure_name && !have_used_before && !image) {
        throw new Error("Please don't forget to insert an image");
    }
    
    if (!have_used_before && image) {
        configs.addedImages[image_name] = image;
    } 
    
    if (into_multi_column && !multi_column_name) {
        throw new Error("Please don't forget to insert the multi column name");
    }    
    
    if (into_header) {
        if (!configs.headerOptions) {
            throw new Error('Please verify if you have inserted the action Activate header before this action');
        }
        
        configs.headerOptions.elements.push(imageObject);
    } else if (into_footer) {
        if (!configs.footerOptions) {
            throw new Error('Please verify if you have inserted the action Activate footer before this action');
        }
        
        configs.footerOptions.elements.push(imageObject);
    } else if (into_background) {
        configs.docDefinition.background.push(imageObject);
    } else if (repeating_structure_name) {
        const usedImage = image_list ? image_list.get(0, image_list.length()).map((item) => parseImageList(item, options)) : imageObject;
        
        if (!configs.repeatedStructures[repeating_structure_name]) {
      		throw new Error(`It wasn't possible to find the repeating structure name ${repeating_structure_name}`);
    	}
        
        if (!into_multi_column) {
            configs.repeatedStructures[repeating_structure_name].forEach((item, index) => {
                const value = usedImage instanceof Array ? usedImage[index] : usedImage;
                
                if (value) item.push(value);
            });
        } else {
            if (!configs.repeatedColumns[multi_column_name]) {
        		const message = `It wasn't possible to find the multi column name ${multi_column_name} in the repeated structure`;
        		throw new Error(message);
      		}

      		configs.repeatedColumns[multi_column_name].forEach((item, index) => {
        		const value = usedImage instanceof Array ? usedImage[index] : usedImage;

        		if (value) item.columns.push(value);
      		});
        }
        
    } else if (into_multi_column) {
        if (!configs.multiColumns[multi_column_name]) {
            throw new Error(`It wasn't possible to find the multi column name ${multi_column_name}`);
        }
        
        configs.multiColumns[multi_column_name].columns.push(imageObject);
    } else {
        configs.docDefinition.content.push(imageObject);
    }

	return { configurations: JSON.stringify(configs) };
    
}