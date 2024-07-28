const properties = PropertiesService.getScriptProperties().getProperties();
const geminiApiKey = properties['GEMINI_API_KEY'];
const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;

function callGemini(prompt, temperature=0) {
  const payload = {
    "contents": [
      {"parts": {
      "text": prompt,
    }, }
    ],
    "generationConfig":  {
      "temperature": temperature,
    },
  };

  const options = { 
    'method' : 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  };

  const response = UrlFetchApp.fetch(geminiEndpoint, options);
  const data = JSON.parse(response);
  Logger.log(data);
  var content = data["candidates"][0]["content"]["parts"][0]["text"];
  content = JSON.parse(content.replace(/```(?:json|)/g, ""))
  return content;
}

