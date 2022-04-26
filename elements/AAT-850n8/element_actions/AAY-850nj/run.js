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

    if (properties.debug_log) {

        console.log("Hello! Copy the object below and send it to me, Vini, the creator of the PDF Conjurer plugin for assistance, it will be helpful. Disable 'debug mode' in the 'Conjure' workflow action to stop logging this to the console");
        console.log("You can also automatically store this in your app's database by reading the 'PDF Model X' state called 'Debug log dump under the event 'Debug log available', then send me once you know that a log is about a faulty attempt to conjure a PDF.");

        let dump = JSON.stringify(instance.data.docDefinition);

        console.log(dump)

        instance.publishState("debug_log_dump", dump)

        instance.triggerEvent("debug_log_available")

    }

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