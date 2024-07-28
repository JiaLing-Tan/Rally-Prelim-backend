const userEmail = "tjllwh@gmail.com";
const sheetCandidate = ss.getSheetByName("candidate");
const valuesCandidate = sheetCandidate.getDataRange().getValues();
const sheetPosition = ss.getSheetByName("openPosition");
const valuesPosition = sheetPosition.getDataRange().getValues();
const sheetEmployee = ss.getSheetByName("employee");
const valuesEmployee = sheetEmployee.getDataRange().getValues();
const sheetTrigger = ss.getSheetByName('trigger');
const valuesTrigger = sheetTrigger.getDataRange().getValues();
const sheetFeedbackInterview = ss.getSheetByName('feedbackInterview');
const valuesFeedbackInterview = sheetFeedbackInterview.getDataRange().getValues();
const sheetRequest = ss.getSheetByName('request');
const valuesRequest = sheetRequest.getDataRange().getValues();
const sheetSchedule = ss.getSheetByName('schedule');
const valueSchedule = sheetRequest.getDataRange().getValues();




function rejectCandidate(id) {
  var rowCandidate = sheetCandidate.getRange("A:A")
    .createTextFinder(id)
    .matchEntireCell(true)
    .findAll()[0]
    .getRow();   
  sheetCandidate.getRange("J" + rowCandidate.toString()).setValue("Rejected");   
  var email = sheetCandidate.getRange("C" + rowCandidate.toString()).getValue();
  var value = "Reject " + id;
  MailApp.sendEmail(email, "Sample rejection", value);
  return value;
}

function getCandidate(){
  var output = [];
  for (var i = 1; i < valuesCandidate.length; i++){
        var row = {};
        row["id"] = valuesCandidate[i][0];
        row["name"] = valuesCandidate[i][1];
        row["email"] = valuesCandidate[i][2];
        row["role"] = objectPosition(valuesCandidate[i][3])['role'];
        row["skills"] = valuesCandidate[i][4];
        row["education"] = valuesCandidate[i][5];
        row["experience"] = valuesCandidate[i][6];
        row["rating"] = valuesCandidate[i][7];
        row["explanation"] = valuesCandidate[i][8];
        row["status"] = valuesCandidate[i][9];
        row["date"] = valuesCandidate[i][10];
        row["contactNumber"] = valuesCandidate[i][11];
        row["resumeId"] = valuesCandidate[i][13];
        

        output.push(row);
      };
  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
}
function getFeedback(){
  var output = [];
  for (var i = 1; i < valuesFeedbackInterview.length; i++){
        var row = {};
        row["interviewerId"] = valuesFeedbackInterview[i][1];
        row["candidateId"] = valuesFeedbackInterview[i][0];
        row["education"] = valuesFeedbackInterview[i][4];
        row["training"] = valuesFeedbackInterview[i][5];
        row["workExperience"] = valuesFeedbackInterview[i][6];
        row["companyKnowledge"] = valuesFeedbackInterview[i][7];
        row["technicalSkills"] = valuesFeedbackInterview[i][8];
        row["multitaskingSkills"] = valuesFeedbackInterview[i][9];
        row["communicationSkills"] = valuesFeedbackInterview[i][10];
        row["teamwork"] = valuesFeedbackInterview[i][11];
        row["stressTolerance"] = valuesFeedbackInterview[i][12];
        row["cultureFit"] = valuesFeedbackInterview[i][13];
        row["overallOpinion"] = valuesFeedbackInterview[i][14];
        output.push(row);
      };
  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
}

function sendEmailWithHTML(email, interviewerName, googleFormLink) {

  var recipient = email;  
  var subject = "Candidate Resume and Appointment Scheduling";


 var htmlBody = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Candidate Resume and Appointment Scheduling</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            text-align: center;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #333;
        }

        p {
            color: #666;
        }

        .btn {
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            background-color: #000000;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
        }

        .btn:hover {
            background-color: #36454F;
            color: #000000;
        }
    </style>
</head>

<body>
      <div class="container">
        <h1>Candidate Resume and Appointment Scheduling</h1>
        <p>Dear ${interviewerName},</p>
        <p>I hope this message finds you well.</p>
        <p>Attached to this email, you will find the resume of the candidate for your review.</p>
        <p>To proceed with scheduling, please follow the instructions outlined in the link below:</p>
        <p><a class="btn" style="color: #ffffff;" href="https://glaze-antique-bfd.notion.site/Create-Appointment-Schedule-19d8eaaa40144eb3b81859275c17743b?pvs=4">Follow Scheduling Instructions</a></p>

        <p>After completing the scheduling instructions, kindly fill out the Google Form provided below, and include the appointment schedule link in the form:</p>
        <p><a class="btn" style="color: #ffffff;" href="${googleFormLink}">Complete Google Form</a></p>
        <p>Thank you for your cooperation and assistance.</p>
        <p>Best regards,<br> HR Department </p>
        <p><strong>Attachment:</strong> Candidate CV </p>
      </div>
    </body>

</html>
`;


  // Define the attachment
  var attachment = DriveApp.getFileById('1DWtLSwSc6KxwUU_7_lQRTvg8IIXXlEEn');  // Replace with the Google Drive file ID

  // Send the email
  MailApp.sendEmail({
    to: recipient,
    subject: subject,
    htmlBody: htmlBody,
    attachments: [attachment.getAs(MimeType.PDF)],  // Adjust MIME type as needed
  });
}

function scheduleInterview(id){
  // const id = "ID28"
  var scheduleForm = FormApp.create("Interview availability")
    .setConfirmationMessage("Your form has been successfully submitted! \n If you need help in rescheduling please reach out to the HR team")
    .setShowLinkToRespondAgain(false)
    .setTitle('Interview agreement');

  var agreement = scheduleForm.addMultipleChoiceItem();

  var page2 = scheduleForm.addPageBreakItem()
    .setTitle('Help us to assess and select better talent!')
    .setGoToPage(FormApp.PageNavigationType.SUBMIT);

  scheduleForm.addParagraphTextItem()
    .setTitle("Please briefly explain why the candidate is rejected so that we can know better the requirement!")
    .setRequired(true);

  var page3 = scheduleForm.addPageBreakItem()
    .setTitle('Your appointment schedule for interview.')
    .setGoToPage(FormApp.PageNavigationType.SUBMIT);

  scheduleForm.addTextItem()
    .setTitle('Please paste your appointment schedule link into the textfield.')
    .setHelpText("Reminder: Visit knowledge base through the link in the email if you haven't create a link yet.")
    .setRequired(true);


  agreement.setTitle("Do you agree to interview the candidate after viewing the materials attached in the email?")
            .setChoices([agreement.createChoice('Yes', page3),
              agreement.createChoice('No', page2)])
            .setRequired(true);
  
  var formLink = scheduleForm.getPublishedUrl();
  var tempSheet = SpreadsheetApp.create(id.toString());
  scheduleForm.setDestination(FormApp.DestinationType.SPREADSHEET, tempSheet.getId());

  ScriptApp.newTrigger('submitAppointmentForm')
    .forSpreadsheet(tempSheet)
    .onFormSubmit()
    .create();

  var email = getInterviewerFromCandidate(id)[0];
  var name = getInterviewerFromCandidate(id)[2];
  sendEmailWithHTML(userEmail, name, formLink);

  // MailApp.sendEmail("jialing030901@gmail.com", "To: " + email, formLink);
  
}

function submitAppointmentForm(e){
  var spreadsheetId = e.source.getId();
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var id = spreadsheet.getName();

  var formUrl = spreadsheet.getFormUrl();
  var formId = formUrl.match(/\/d\/([^\/]+)/)[1];

  DriveApp.getFileById(spreadsheetId).setTrashed(true);
  DriveApp.getFileById(formId).setTrashed(true);

  var response = e.values;
  var rowCandidate = sheetCandidate.getRange("A:A")
    .createTextFinder(id)
    .matchEntireCell(true)
    .findAll()[0]
    .getRow();
  

  if(response[1] == "Yes"){
    sheetCandidate.getRange("J" + rowCandidate.toString()).setValue("Invited");
    var email = sheetCandidate
      .getRange("C" + rowCandidate.toString())
      .getValue();

    MailApp.sendEmail(email, "Sample invitation mail" , response[3]);

  }else{
    var interviewer = getInterviewerFromCandidate(id)[1];
    var request = [generateId("R", sheetRequest), interviewer, response[0], "Dissatisfactory in candidate", response[2], "Recruitment", id, "In Progress"];
    sheetRequest.appendRow(request);
    sheetCandidate
      .getRange("J" + rowCandidate.toString())
      .setValue("Rejected");

  };

  deleteTrigger(e.triggerUid);
}

function getOptions() {
  var now = new Date();
  TIME_DIFF = 60 * 60 * 100;
  var earlier = new Date(now.getTime() - TIME_DIFF)
  return {
    updatedMin: earlier.toISOString(),
    maxResults: 10,
    orderBy: 'updated',
    singleEvents: true,
    showDeleted: false
  }
}


function invitationAccepted(rowCandidate){
  
  // const calendar = CalendarApp.getCalendarById(email);
  var options = getOptions();
  var events = Calendar.Events.list(userEmail, options);

  if(!events.items) return undefined;
  var event = events.items[events.items.length-1];
  sheetSchedule.appendRow([event.iCalUID]);
  var event = CalendarApp.getEventById(event.id);

  // timeDiff = 60 * 60 * 1000; //1 hour
  timeDiff = 60*60;
  // var dateTime = new Date(event.getStartTime() - timeDiff);
  var dateTime = new Date(new Date().getTime() + timeDiff);
  Logger.log(dateTime);
  var formattedDate = Utilities.formatDate(new Date(event.getStartTime()), "GMT+8", "MM/dd/yyyy HH:mm:ss"); 

  var feedbackTrigger = ScriptApp.newTrigger('sendFeedbackForm')
    .timeBased()
    .at(dateTime)
    .create();
  var candidate = sheetCandidate.getRange("A" + rowCandidate.toString()+ ":D" +rowCandidate.toString()).getValues()[0];
  Logger.log(candidate);
  var content = [encodeLongId(feedbackTrigger.getUniqueId()), formattedDate, candidate[0], candidate[1], candidate[3]];
  sheetTrigger.appendRow(content);
}



function sendFeedbackForm(e){
  var triggerColumnValues = sheetTrigger.getRange("A:A").getValues();
  Logger.log(e.triggerUid);
  var rowTrigger = -1;
    for (var i = 0; i < triggerColumnValues.length; i++) {
      var value = triggerColumnValues[i][0].toString();
      if (encodeLongId(e.triggerUid) == value) {
        rowTrigger = i + 1;
        break;
      }
    }
    Logger.log("Row Trigger: "+ rowTrigger);

  // var rowTrigger = sheetTrigger.getRange("A:A")
  //     .createTextFinder(e.triggerUid)
  //     .matchEntireCell(true)
  //     .findAll()[0]
  //     .getRow();
  var candidate = sheetTrigger.getRange("A" + rowTrigger.toString()+ ":E" +rowTrigger.toString()).getValues()[0];
  var feedbackForm = FormApp.create("Candidate Feedback")
    .setConfirmationMessage("Your feedback has been successfully submitted! \nIf you need any help please reach out to the HR team.")
    .setShowLinkToRespondAgain(false)
    .setTitle('Candiate Feedback')
    .setDescription("Feedback form: " + candidate[3] + " ("+candidate[2]+") Role: " + candidate[4]);

  var questionList = ["Education", "Training", "Work Experience", "Company Knowledge", "Technical Skills", "Multitasking Skills", "Communication Skills", "Teamwork", "Stress Tolerance", "Culture Fit"];
  var scale = []
  for (var i = 1; i < 6; i++){
    scale.push(i.toString());
  }
  feedbackForm.addGridItem()
    .setRows(questionList)
    .setColumns(scale)
    .setTitle("Please rate the candidate on a scale from 1-5.")
    .setHelpText("1: Poor - 5: Excellent")
    .setRequired(true);

  feedbackForm.addParagraphTextItem()
    .setTitle("Overall Evaluation")
    .setRequired(true);

  var formLink = feedbackForm.getPublishedUrl();
  var tempSheet = SpreadsheetApp.create(candidate[2]);
  feedbackForm.setDestination(FormApp.DestinationType.SPREADSHEET, tempSheet.getId());
  var email = getInterviewerFromCandidate(candidate[2])[0];

  var feedbackTrigger = ScriptApp.newTrigger('submitFeedbackForm')
    .forSpreadsheet(tempSheet)
    .onFormSubmit()
    .create();

  sheetTrigger.getRange("A" + rowTrigger.toString()).setValue(encodeLongId(feedbackTrigger.getUniqueId()));

  MailApp.sendEmail(userEmail, "Sample feedback form mail", formLink);
  Logger.log("Feedback form sent for" + candidate[2]);

  deleteTrigger(e.triggerUid);

}

function submitFeedbackForm(e){
  
  var spreadsheetId = e.source.getId();
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var id = spreadsheet.getName();

  var formUrl = spreadsheet.getFormUrl();
  var formId = formUrl.match(/\/d\/([^\/]+)/)[1];

  DriveApp.getFileById(spreadsheetId).setTrashed(true);
  DriveApp.getFileById(formId).setTrashed(true);

  var triggerColumnValues = sheetTrigger.getRange("A:A").getValues();
  var rowTrigger = -1;
    for (var i = 0; i < triggerColumnValues.length; i++) {
      var value = triggerColumnValues[i][0].toString();
      if (encodeLongId(e.triggerUid) == value) {
        rowTrigger = i + 1;
        break;
      }
    }
  Logger.log("Row Trigger: "+ rowTrigger);
  var interviewDate = sheetTrigger.getRange("B" + rowTrigger.toString()).getValue();
  sheetTrigger.deleteRow(rowTrigger);

  var response = e.values;
  var interviewer = getInterviewerFromCandidate(id)[1];
  var content = [id, interviewer, interviewDate].concat(response);
  sheetFeedbackInterview.appendRow(content);

  var rowCandidate = sheetCandidate.getRange("A:A")
    .createTextFinder(id)
    .matchEntireCell(true)
    .findAll()[0]
    .getRow();
  Logger.log("submit:" + rowCandidate.toString());
  sheetCandidate.getRange("J" + rowCandidate.toString()).setValue("Evaluating");
  deleteTrigger(e.triggerUid);
}





function getInterviewerFromCandidate(id){
  var rowCandidate = sheetCandidate.getRange("A:A")
    .createTextFinder(id)
    .matchEntireCell(true)
    .findAll()[0]
    .getRow();
  sheetCandidate.getRange("J" + rowCandidate.toString()).setValue("Scheduling");
  var position = sheetCandidate
    .getRange("D" + rowCandidate.toString())
    .getValue();

  var interviewer = objectPosition(position)['interviewerId'];

  var rowEmployee = sheetEmployee.getRange("A:A")
    .createTextFinder(interviewer)
    .matchEntireCell(true)
    .findAll()[0]
    .getRow();
  var email = sheetEmployee
    .getRange("C" + rowEmployee.toString())
    .getValue();
  var name = sheetEmployee
    .getRange("B" + rowEmployee.toString())
    .getValue();
  return [email, interviewer,name];
}

function offerPosition(id){
  var rowCandidate = sheetCandidate.getRange("A:A")
    .createTextFinder(id)
    .matchEntireCell(true)
    .findAll()[0]
    .getRow();
  var name = sheetCandidate.getRange("B" + rowCandidate.toString()).getValue();
  var email = sheetCandidate.getRange("C" + rowCandidate.toString()).getValue();

  var htmlBody = '<h1>Congratulation! ' + name + '</h1>' +
                 '<p>This is an <strong>offer letter</strong> from <strong>Rally</strong>.</p>' + 
                 "<p>You're accepted.</p>";

  var documents = getDestination(["Rally", "Onboarding"]).getFiles();
  var attachements = [];
  while (documents.hasNext()) {
    var document = documents.next();
    attachements.push(document.getAs("application/pdf"));
  }

  GmailApp.sendEmail(email, "Sample offer letter", "", {
    htmlBody: htmlBody,
    attachments: attachements
    
  });
  sheetCandidate.getRange("J" + rowCandidate.toString()).setValue("Offered");
  return("Offered " + id);
}

function offerAccepted(id){
  var rowCandidate = sheetCandidate.getRange("A:A")
    .createTextFinder(id)
    .matchEntireCell(true)
    .findAll()[0]
    .getRow();
  sheetCandidate.getRange("J" + rowCandidate.toString()).setValue("Confirmed");  
}

function onboarding(id){
  var rowCandidate = sheetCandidate.getRange("A:A")
    .createTextFinder(id)
    .matchEntireCell(true)
    .findAll()[0]
    .getRow();
  var name = sheetCandidate.getRange("B" + rowCandidate.toString()).getValue();
  var email = sheetCandidate.getRange("C" + rowCandidate.toString()).getValue();
  sheetCandidate.getRange("J" + rowCandidate.toString()).setValue("Onboarding");  
  var htmlBody = '<h1>Welcome! ' + name + '</h1>' +
                 '<p>This is an <strong>onboarding message</strong> from <strong>Rally</strong>.</p>' + 
                 "<p>You're in!</p>";
  GmailApp.sendEmail(email, "Sample onboarding letter", "", {
    htmlBody: htmlBody,
    // attachments: attachements
    
  });
  return("Onboard: " + id);
}

