function deleteTrigger(triggerId) {
  // Loop over all triggers.
  const allTriggers = ScriptApp.getProjectTriggers();
  for (let index = 0; index < allTriggers.length; index++) {
    // If the current trigger is the correct one, delete it.
    if (allTriggers[index].getUniqueId() === triggerId) {
      ScriptApp.deleteTrigger(allTriggers[index]);
      break;
    }
  }
}

function generateId(initial, paramSheet){
  var maxRows = paramSheet.getLastRow();
  var lastId = paramSheet.getRange("A" + maxRows.toString()).getValue();
  var newId = (Number(lastId.replace(initial, "")) + 1).toFixed(0);
  return (initial+newId);
}

function testhere(){
  Logger.log(generateId("E", sheetEmployee));
}

function encodeLongId(id){
  var v = Utilities.base64Encode(Utilities.newBlob(id).getBytes());
  return v;
}

function convertPDFToText(fileId, language){

  // Read the PDF file in Google Drive
  const pdfDocument = DriveApp.getFileById(fileId);

  // Use OCR to convert PDF to a temporary Google Document
  // Restrict the response to include file Id and Title fields only
  const { id, name } = Drive.Files.create(
    {
      name: pdfDocument.getName().replace(/\.pdf$/, ''),
      mimeType: MimeType.GOOGLE_DOCS,
    },
    pdfDocument.getBlob(),
    {
      ocrLanguage: language,
      fields: 'id,name',
    }
  );

  // Use the Document API to extract text from the Google Document
  const textContent = DocumentApp.openById(id).getBody().getText();

  // Delete the temporary Google Document since it is no longer needed
  DriveApp.getFileById(id).setTrashed(true);

  // (optional) Save the text content to another text file in Google Drive
  const textFile = DriveApp.createFile(`${name}.txt`, textContent, 'text/plain');
  return textContent;
};

function formatName(name) {
  if(name != null){
    var reg = /\b(\w)/g;
    function replace(firstLetters) {
      return firstLetters.toUpperCase();
    }
    var formattedName = name.toLowerCase().replace(reg, replace);
    return formattedName;
    } else {
      return null;
    }
}

function checkEmail(email){
  var range = sheetCandidate.getRange("C:C");
    var emailColumnValues = range.getValues();
    
    var rowCandidate = -1;
    for (var i = 0; i < emailColumnValues.length; i++) {
      var value = emailColumnValues[i][0].toString().trim();
      if (value.match(new RegExp("^" + email + "$", "i"))) {
        rowCandidate = i+1;
        break;
      }
    }
  return rowCandidate;
}






				















