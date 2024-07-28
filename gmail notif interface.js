
function doPost(e){
  convertMail();
  // Logger.log(e);
  // // var data = JSON.parse(e.postData.getDataAsString());
  // var postBody = JSON.parse(e.postData.getDataAsString());
  // var messageData = Utilities.newBlob(Utilities.base64Decode(postBody.message.data)).getDataAsString();
  // mail = ss.getSheetByName("mail");
  // ss.appendRow([new Date(), messageData, JSON.stringify(postBody,undefined,2)])
  // mail.appendRow([new Date(), messageData, JSON.stringify(postBody,undefined,2)]);
  return 200;
}



function watch(){
  var payload ={topicName: "projects/summer-artwork-430308-s9/topics/GmailNotification",
  labelIds: ["INBOX"],
  labelFilterBehavior: "INCLUDE"};

  var option = {
    method : "POST",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    headers: {Authorization: "Bearer " + ScriptApp.getOAuthToken()},
    muteHttpException: true
  }

  var response = UrlFetchApp.fetch('https://www.googleapis.com/gmail/v1/users/me/watch', option);
  Logger.log(response.getContentText());
}

function stop(){
  var payload ={topicName: "projects/summer-artwork-430308-s9/topics/GmailNotification",
  labelIds: ["INBOX"],
  labelFilterBehavior: "INCLUDE"};

  var option = {
    method : "POST",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    headers: {Authorization: "Bearer " + ScriptApp.getOAuthToken()},
    muteHttpException: true
  }

  var response = UrlFetchApp.fetch('https://www.googleapis.com/gmail/v1/users/me/stop', option);
  Logger.log(response.getContentText());
}

// function getLabelId(){
//   try{
//     const response = Gmail.Users.Labels.list('me');

//   }
    
// }