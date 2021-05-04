function(instance, properties, context) {

    // finally generates the PDF
    const fileNameFix = (inputedName) => {

        if (inputedName.substring(inputedName.length - 4) === ".pdf") {
      
          return inputedName;
      
        } else {
      
          return `${inputedName}.pdf`;
      
        }
      
      };

      let fixedFileName = fileNameFix(properties.file_name);


    instance.data.docDefinition.info = {

        title: fixedFileName,

    };

    if (!properties.no_browser_download) { // case the app maker doesn't wants the user to dl anything right now

        pdfMake.createPdf(instance.data.docDefinition).download(fixedFileName); // this generates the pdf file and offers for download

    }

    if (properties.save_to_database) { // checks if checkbox was checked

        const pdfDocGenerator = pdfMake.createPdf(instance.data.docDefinition); // and this uploads it to the bubble app storage
        pdfDocGenerator.getBase64((data) => {

            context.uploadContent(fixedFileName, data, function (err, url) {
                instance.publishState("saved_pdf", url); // these are just one argument of this callback
                instance.triggerEvent("pdf_uploaded_and_available_in_element_state" // these are just one argument, I broke the line for readability
                    , function (err) { console.log(err) }) // this is actually the second argument of this callback
            }, properties.attach_pdf_to)

        });
    }






}