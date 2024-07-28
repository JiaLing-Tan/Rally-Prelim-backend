const DATABASE_ID3 = properties['DATABASE_ID3'];
const NOTION_TOKEN3 = properties['NOTION_TOKEN3'];

var header = {
    Authorization: `Bearer ${NOTION_TOKEN3}`,
    Accept: 'application/json',
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json'
  };

function getOptions(method, payload){  //不可修改
  var options = {
    method: method, // PATCH GET POST
    headers: header,
    muteHttpExceptions: true,
    ...(payload && { payload: JSON.stringify(payload)}),
  };
  return options
}

// function doGet(e){

//   const funcName = e.parameter.funcName;
  
//   try {

//     if (e.parameter.token != 'eACFllhxBI2Faa0qKTJuV2ohOw8DD9RQS3Mzt6yOoeXahX7s0o1zZVTLo6uji55M'){
//       throw new Error('Invalid token parameter')
//     }

//     let response_content;
    
//     switch (funcName) {
//       case 'getDatabaseRows':
//         response_content = getDatabaseResponseRows(DATABASE_ID3);
//         break;
//       case 'getBlockInPage':
//         response_content = getBlockInPage(latestCreatedPageID);
//       case 'createDatabasePost':

//           response_content = createDatabasePost(
//             e.parameter.emoji_unicode, 
//             e.parameter.optional_url, 
//             e.parameter.page_title, 
//             e.parameter.tag, 
//             e.parameter.description, 
//             e.parameter.paragraph_content , 
//             e.parameter.heading, 
//             e.parameter.cover
//             )
        
//         case 'getNotionBlocks':
//           response_content = getNotionBlocks(e.parameter.pageId)
//         break;

//       default:
//         throw new Error('Invalid funcName parameter');
//     }

//     return ContentService.createTextOutput(JSON.stringify(response_content)).setMimeType(ContentService.MimeType.JSON);
    
//   }catch (error) {
//     return ContentService.createTextOutput(JSON.stringify({ error: error.message }))
//       .setMimeType(ContentService.MimeType.JSON);
//   }
// }

function getDatabaseResponseRows(database_id) {
  /**
   * Function return Rows in Databse
   * @returns {list} A list of notion response contents (object).
   * @dependency: notionApiRequest().
*/
  const url = `https://api.notion.com/v1/databases/${database_id}/query`;

  const payload = {sorts: [{ timestamp: "created_time", direction: "descending" }],};

  var response_content = notionApiRequest(url, payload, "POST");
  Logger.log(response_content)
  return ContentService.createTextOutput(JSON.stringify(response_content)).setMimeType(ContentService.MimeType.JSON);
  return response_content;
  }




function createDatabasePost(emoji_unicode, optional_url, page_title, tag, description, paragraph_content ,heading, cover){ //Done
  /**
   * Function Create Rows in Databse
   * @returns {Null}
   * @dependency: notionApiRequest().
   * 
   * emoji_unicode
   * optional_url
   * page_title
   * tag
   * description
   * paragraph_content
   * heading
   * cover
*/

  var payload = {

    parent: { database_id: DATABASE_ID3 }, //database_id
    cover: {
      type: "external",
      external: {
        url: cover 
      }
    },
    icon: {
      type: "emoji", //Optional
      emoji: emoji_unicode
    },

    properties: {
      "URL": 
      {
        "type": "url",
        "url": optional_url
      },
      "Name": 
      { 
        title: [
          {
            text: {
              content: page_title  //Must have
            }
          }
        ]
      },
      "Tags": 
      {
          "select": {
            "name": tag,
          }
      },
      "Description": {
        "type": "rich_text",
        "rich_text": [
          {
            "type": "text",
            "text": {
              "content": description,
            },
            "plain_text": description,
          }
        ]
      }
    },
      
    children: [
      {
        object: "block",
        type: "heading_2", // heading 1, 2, or 3
        heading_2: {
          rich_text: [
            {
              text: {
                content: " ", //page_heading
              }
            }
          ]
        }
      },
      {
        object: "block",
        type: "paragraph", // Correct block type for paragraphs
        paragraph: {
          rich_text: [
            {
              text: {
                content: paragraph_content
                // link: {
                //   url: "https://en.wikipedia.org/wiki/Lacinato_kale"
                // },
              }
            }
          ],
          color: "default"
        }
      },
    ]
  };
  
  let url = 'https://api.notion.com/v1/pages'

  let options = getOptions('POST',payload)

  const response = UrlFetchApp.fetch(url, options);

  // response = notionApiRequest(url,payload,'POST')

  Logger.log("function createDatabasePost: Create Database Post success")
  Logger.log(response.getContentText())
  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
  return response
}


function getNotionBlocks(pageId) {
  var notionEndpoint = 'https://api.notion.com/v1/blocks/' + pageId + '/children';


  var options = {
    'method': 'GET',
    'headers': header,
  };

  var response = UrlFetchApp.fetch(notionEndpoint, options);
  var responseData = JSON.parse(response.getContentText());

  var blocksJSON = {
    'heading_2': [],
    'content': [],
    // Add more block types as needed
  };

  if (responseData.hasOwnProperty('results')) {
    Logger.log(responseData.results)
    var blocks = responseData.results;
    blocks.forEach(function(block) {
      switch (block.type) {
        case 'heading_2':
          blocksJSON['heading_2'].push({
            'text': block.heading_2.rich_text[0].plain_text
          });
          break;
        case 'paragraph':
         if (block.paragraph.rich_text && block.paragraph.rich_text.length > 0) {
          blocksJSON['content'].push(block.paragraph.rich_text[0].text.content);
        } else {
          // blocksJSON['content'].push(null);
        }
        break;
        case 'image':
           if (block.image && block.image.type === 'external') {
          Logger.log("external")
          imageUrl = block.image.external.url;
        } else if (block.image && block.image.file) {
          imageUrl = block.image.file.url;
        } else {
          Logger.log(null)
          // imageUrl = null; // Handle case where image URL is not available
        }
        blocksJSON['content'].push(imageUrl);
        break;
        default:
          // Handle other block types as needed
          break;
      }
    });
  }

  Logger.log(blocksJSON)
  return ContentService.createTextOutput(JSON.stringify(blocksJSON)).setMimeType(ContentService.MimeType.JSON);
  return (blocksJSON) //test

}




function notionApiRequest(url, payload_dict, method) {
  /**
   * Function return notion contents list
   * @returns {list} A list of notion response contents (object).
   * @dependency: getOptions().
*/
  let options = getOptions(method,payload_dict)

  const response = UrlFetchApp.fetch(url, options);

  if (response.getResponseCode() === 200) {

    const response_ContentText = JSON.parse(response.getContentText());

    if (response_ContentText.length == 0) {throw new Error("No data returned from Notion API. Check your Notion token.");}

    Logger.log("Get Database Row list Success")
    return response_ContentText;

  } else if (response.getResponseCode() === 401) {
    throw new Error("Notion token is invalid.");
  } else {
    throw new Error(response.getContentText());
  }
}