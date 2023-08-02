function(properties, context) {

  const fetch = require('node-fetch');

  const {
    prev_configs,
    text,
    parse_bbcode,
    custom_margins,
    margin_top,
    margin_left,
    margin_right,
    margin_bottom,
    style,
    page_break,
    into_multi_column,
    column_width,
    multi_column_name,
    into_footer,
    into_header,
    into_background,
    repeating_structure_name,
    text_list,
    fixed_width_column_size,
  } = properties;

  function hasTheKey(object, key) {
    return Object.keys(object).includes(key);
  }

  const configs = JSON.parse(prev_configs);

  const fonts = { ...configs.defaultFonts, ...configs.addedFonts };

  const options = {};

  if (custom_margins) options.margin = [margin_left, margin_top, margin_right, margin_bottom];
  if (style && hasTheKey(configs.docDefinition.styles, style)) options.style = style;
  if (page_break !== 'Unspecified') options.pageBreak = page_break.toLowerCase();

  const willBeInsertedIntoColumn = into_multi_column || into_header || into_footer;




  if (willBeInsertedIntoColumn) {


    if (column_width === 'Fit available space') {

      options.width = "*";

    } else if (column_width === "Fit content") {

      options.width = "auto";

    } else if (column_width === "Fixed width") {

      options.width = fixed_width_column_size;

    }

  }





  if (!text && !repeating_structure_name) {
    throw new Error("Please don't forget to insert a text");
  }

  let textObject = { text, ...options };

  if (parse_bbcode) {
    const parserURL = 'https://meta-l.cdn.bubble.io/f1687362558951x515863457607741440/bbcodeparser_fixedcode_v4_table.js';

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
            'quote',
            'table'
          ));
        })
        .catch((err) => {
          callback(err, null);
        });
    });

    const stack = parser.getParsedText(text);

    textObject = { stack, ...options };
  }

  if (into_multi_column && !multi_column_name) {
    throw new Error('Please insert the multi column name');
  }

  // Put the element into the corresponding place

  // Into header
  if (into_header) {
    if (!configs.headerOptions) {
      throw new Error('Please verify if you have inserted the action Activate header before this action');
    }

    configs.headerOptions.elements.push(textObject);

    // Into footer
  } else if (into_footer) {
    if (!configs.footerOptions) {
      throw new Error('Please verify if you have inserted the action Activate footer before this action');
    }

    configs.footerOptions.elements.push(textObject);

    // Into background
  } else if (into_background) {
    configs.docDefinition.background.push(textObject);

    // Into a repeating structure
  } else if (repeating_structure_name) {
    const usedText = text_list ? text_list.get(0, text_list.length()) : textObject;

    if (!configs.repeatedStructures[repeating_structure_name]) {
      throw new Error(`It wasn't possible to find the repeating structure name ${repeating_structure_name}`);
    }

    if (!into_multi_column) {
      configs.repeatedStructures[repeating_structure_name].forEach((item, index) => {
        const value = usedText instanceof Array ? usedText[index] : usedText;

        if (value) item.push(typeof value === 'object' ? value : { text: value, ...options });
      });
    } else {
      if (!configs.repeatedColumns[multi_column_name]) {
        const message = `It wasn't possible to find the multi column name ${multi_column_name} in the repeated structure`;
        throw new Error(message);
      }

      configs.repeatedColumns[multi_column_name].forEach((item, index) => {
        const value = usedText instanceof Array ? usedText[index] : usedText;

        if (value) item.columns.push(typeof value === 'object' ? value : { text: value, ...options });
      });
    }

    // Into multi columns
  } else if (into_multi_column) {
    if (!configs.multiColumns[multi_column_name]) {
      throw new Error(`It wasn't possible to find the multi column name ${multi_column_name}`);
    }

    configs.multiColumns[multi_column_name].columns.push(textObject);
  } else {
    configs.docDefinition.content.push(textObject);
  }

  return { configurations: JSON.stringify(configs) };

}