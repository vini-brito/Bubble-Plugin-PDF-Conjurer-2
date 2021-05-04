function(instance, properties, context) {

    const protocolFix = (possibleUrl) => {
        if (possibleUrl.substring(0, 7) === "https:") {
            return possibleUrl;

        } else {
            return `https:${possibleUrl}`;
        }
    };


    let myProperUrlRegular = protocolFix(properties.regular);
    let myProperUrlBold = protocolFix(properties.bold);
    let myProperUrlItalics = protocolFix(properties.italics);
    let myProperUrlBolditalics = protocolFix(properties.bolditalics);


    pdfMake.fonts[properties.name] = {

        normal: myProperUrlRegular,
        bold: myProperUrlBold,
        italics: myProperUrlItalics,
        bolditalics: myProperUrlBolditalics
    
    };



}