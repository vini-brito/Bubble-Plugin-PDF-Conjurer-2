function(instance, properties, context) {
  
// finally generates the PDF
    
let pasteurizedFileName = properties.file_name.replace(/^(con|prn|aux|nul|com[0-9]|lpt[0-9])$|([<>:"\/\\|?*])|(\.|\s)$/ig, ""); // sanitizing because users may pass dots or other stuff that makes the file loses its extension on Windows and other nasty side effects    

instance.data.docDefinition.info = {
    								title: `${pasteurizedFileName}`,
    								/*author: 'john doe',
    								subject: 'subject of document',
    								keywords: 'keywords for document',*/
  };
	
// this is in case no async operation was requested, for now only the insertion of images is async	
	
if (instance.data.imagesAreLoadedPromise === undefined) {
	
	pdfMake.createPdf(instance.data.docDefinition).download(pasteurizedFileName); // this generates the pdf file
    
    if (properties.save_to_database) { // checks if checkbox was checked
    
    const pdfDocGenerator = pdfMake.createPdf(instance.data.docDefinition); // and this uploads it to the bubble app storage
    pdfDocGenerator.getBase64((data) => {
    
	context.uploadContent(properties.file_name, data, function(err, url) {
        instance.publishState("saved_pdf", url) ; // these are just one argument of this callback
        instance.triggerEvent("pdf_uploaded_and_available_in_element_state" // these are just one argument, I broke the line for readability
                              , function(err){console.log(err)}) // this is actually the second argument of this callback
    }, properties.attach_pdf_to)

        });
    }
	
} else {
	
// I wrapped this around a promise so this only runs when the async image loading and writing its dataURL into library finishes
// otherwise no image would show up. This cant be sync because sync code runs first across workflow steps! 
// Thus only loading async stuff (images) after the pdf was generated
	
instance.data.imagesAreLoadedPromise.then(function(result) {
 	pdfMake.createPdf(instance.data.docDefinition).download(pasteurizedFileName); // this generates the pdf file	
   
    if (properties.save_to_database) { // checks if checkbox was checked
    
    const pdfDocGenerator = pdfMake.createPdf(instance.data.docDefinition); // and this uploads it to the bubble app storage
    pdfDocGenerator.getBase64((data) => {
    
	context.uploadContent(properties.file_name, data, function(err, url) {
        instance.publishState("saved_pdf", url) ; // these are just one argument of this callback
        instance.triggerEvent("pdf_uploaded_and_available_in_element_state" // these are just one argument, I broke the line for readability
                              , function(err){console.log(err)}) // this is actually the second argument of this callback
    }, properties.attach_pdf_to)

        });
    }
}, function(err) {
	if (err === undefined || err === null) {
		err = "an image wasnt loaded, this also happens because none was asked to, in this case just ignore this";
	}
 console.log(err); // I don't really reject the promise in this current flow, but I'll leave this here in case the need to reject it arises in the future
});
	
}
	


}