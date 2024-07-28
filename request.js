function getRequest() {
  var output = []
  for (var i = 1; i < valuesRequest.length; i++){
    var row = {};
    row["id"] = valuesRequest[i][0];
    row["employeeId"] = valuesRequest[i][1];
    row["timestamp"] = valuesRequest[i][2];
    row["requestHeader"] = valuesRequest[i][3];
    row["requestBody"] = valuesRequest[i][4];
    row["tag"] = valuesRequest[i][5];
    row["remark"] = valuesRequest[i][6];
    row["status"] = valuesRequest[i][7];
    output.push(row);
  }
  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
  
}
