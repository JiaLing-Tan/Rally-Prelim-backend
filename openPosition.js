function getOpenPosition(){
  var output = [];
  for(var i = 1; i < valuesPosition.length; i++){
    var row = {};
    row['id'] = valuesPosition[i][0];
    row['role'] = valuesPosition[i][1];
    row['department'] = valuesPosition[i][2];
    row['skill'] = valuesPosition[i][3];
    row['experience'] = valuesPosition[i][4];
    row['interviewerId'] = valuesPosition[i][5];
    row['minBudget'] = valuesPosition[i][6];
    row['maxBudget'] = valuesPosition[i][7];
    row['status'] = valuesPosition[i][8];
    output.push(row);
  }
  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
}