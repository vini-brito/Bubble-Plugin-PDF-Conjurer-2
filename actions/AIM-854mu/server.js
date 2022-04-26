function(properties, context) {
	
    const { 
        page_size, 
        page_orientation, 
        custom_margins, 
        margin_left, 
        margin_top, 
        margin_right, 
        margin_bottom 
    } = properties;
    
    // Configure page properties:
    
    const docDefinition = { 
        pageSize: page_size, 
        pageOrientation: page_orientation.toLowerCase(),
        background: [],
        content: [], 
        styles: {},
    };
    
    if (custom_margins) docDefinition.pageMargins = [margin_left, margin_top, margin_right, margin_bottom];
    
    // Configure default fonts
    
    const defaultFonts = {
  		'Courier New': {
    		normal: 'Courier',
    		bold: 'Courier-Bold',
    		italics: 'Courier-Oblique',
    		bolditalics: 'Courier-BoldOblique',
  		},
        
  		Helvetica: {
    		normal: 'Helvetica',
    		bold: 'Helvetica-Bold',
    		italics: 'Helvetica-Oblique',
    		bolditalics: 'Helvetica-BoldOblique',
  		},
        
  		'Times New Roman': {
    		normal: 'Times-Roman',
    		bold: 'Times-Bold',
    		italics: 'Times-Italic',
    		bolditalics: 'Times-BoldItalic',
  		},
        
  		Symbol: {
    		normal: 'Symbol',
  		},
        
  		ZapfDingbats: {
    		normal: 'ZapfDingbats',
  		},
	};
    
    // Configure files (fonts and images)
    
    const addedFonts = {
        Roboto: {
      		normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
      		bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
      		italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
      		bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
    	}
    };
    
    const configs = { 
        addedImages: {}, 
        addedFonts, 
        defaultFonts,
        docDefinition,
        multiColumns: {},
        repeatedStructures: {},
        repeatedTables: {},
        repeatedColumns: {},
        advancedTables: {},
    };
    
    // Transform configs into string
    const configurations = JSON.stringify(configs);
    
    // This configurations will contain the docDefinition properties and must be passed to the next action
    // * The links (like images and added fonts) must be trasformed into buffer before its insetion into pdfmake
    return { configurations };
}