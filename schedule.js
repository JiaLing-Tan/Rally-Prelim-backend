// function doGet(e){
//   if  (e.parameter.funcName == 'getCalIdFromSheet'){
//     nestedJson = getCalIdFromSheet()
//     return ContentService.createTextOutput(JSON.stringify(nestedJson)).setMimeType(ContentService.MimeType.JSON);
//   }
//   else{
//     ContentService.createTextOutput(JSON.stringify('Invalid funcName parameter')).setMimeType(ContentService.MimeType.JSON);
//   }

// }


function getCalIdFromSheet() {

//从sheet拿cid而已

  // var spreadsheetId = '1v5XgAH_o_UmdfApjbja7xM4H5lUh0_6EQN44dBUg7ks';  // Replace with the ID of the spreadsheet you want to access
  // var sheetName = 'schedule';  // Replace with the name of the sheet you want to access

  // // Open the spreadsheet by ID
  // var spreadsheet = SpreadsheetApp.openById(spreadsheetId);

  // // Access the sheet by name
  // var sheet = spreadsheet.getSheetByName(sheetName);

  var lastRow = sheetSchedule.getLastRow();
  
  // var firstEmptyRow = lastRow+1
  Logger.log(`lastrow (contain item): ${lastRow}`)



  var range = sheetSchedule.getRange('A2:A' + lastRow);
  
  var iCalIds = range.getValues();
  Logger.log(`Icalids: ${iCalIds}`)


//这边一下不用改


  const calendar = CalendarApp.getCalendarById(userEmail);
  Logger.log(calendar);

  let myEvents = iCalIds.map(function(x){return calendar.getEventById(x)});
  Logger.log(myEvents);

  nestedJson = myEvents.map(
    function(x){
    return {
      'title': x.getTitle(),'startTime':convertToFlutterDateTime(x.getStartTime()), 'endTime':convertToFlutterDateTime(x.getEndTime()),}
      }
      )
  Logger.log(nestedJson)
  return ContentService.createTextOutput(JSON.stringify(nestedJson)).setMimeType(ContentService.MimeType.JSON);
}



function convertToFlutterDateTime(dateString) {
  // var dateString = "Mon Jul 22 2024 00:00:00 GMT+0800 (Singapore Standard Time)";

  // Convert date string to Date object
  var date = new Date(dateString);

  // Extract date and time components
  var year = date.getFullYear();
  var month = date.getMonth() + 1; // JavaScript months are zero-indexed
  var day = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();

   var jsonMap = {
    "year": year,
    "month": month,
    "day": day,
    "hours": hours,
    "minutes": minutes
  };

  Logger.log(jsonMap); // Output: "DateTime(2024, 7, 21, 0, 0)" (adjusted for UTC)
  return jsonMap
}