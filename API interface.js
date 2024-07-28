const ss = SpreadsheetApp.openById(properties['SHEET_ID']);



function doGet(req){
  var result = {"status": "Success", "data":"data"};
  Logger.log(req.parameter.funcName);
  if (req.parameter.token == properties['TOKEN'])
  
  {switch (req.parameter.funcName) {
      
      case "rejectCandidate":
        result["data"] = rejectCandidate(req.parameter.id);        
        break;

      case "scheduleInterview":
       result["data"] = scheduleInterview(req.parameter.id);
       break;

      case "offerPosition":
      result["data"] = offerPosition(req.parameter.id);
      break;

      case "onboarding":
      result["data"] = onboarding(req.parameter.id);
      break;

      case "getCandidate":
       return getCandidate();          

      case "getFeedback":
        return getFeedback();  

      case "getRequest":
        return getRequest();  

      case "getOpenPosition":
        return getOpenPosition();  

      case 'getDatabaseRows':
        return getDatabaseResponseRows(DATABASE_ID3);
       
      case 'createDatabasePost':

          return createDatabasePost(
            req.parameter.emoji_unicode, 
            req.parameter.optional_url, 
            req.parameter.page_title, 
            req.parameter.tag, 
            req.parameter.description, 
            req.parameter.paragraph_content , 
            req.parameter.heading, 
            req.parameter.cover
            );
        
        case 'getNotionBlocks':
          return getNotionBlocks(req.parameter.pageId);
        
        case 'getCalIdFromSheet':
          return getCalIdFromSheet();

      default:
        result["status"] = "Failed";
        result["data"] = "Unknown function name: " + req.parameter.funcName;
        break;
    }
    
  }else{
    result["status"] = "Failed";
    result["data"] = "Unauthorized";
  }
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  
}


