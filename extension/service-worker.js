console.log("Start of background script");

// Return HTML code from message.website
chrome.runtime.onMessage.addListener(function (message, sender, senderResponse) {
  if (message.action === 'fetchHTML') {
    console.log('Background script fetching website: ' + message.website)
    
    fetch(message.website).then(response => {
      if (response.ok) {
        return response.text();
      }
      throw new Error('Fetch() failed, likely Vivino temporarily blocked your IP.');
    }).then(response => {
      senderResponse(response);
    })
    .catch((error) => {
      console.log(error)
    })
  }
  return true
});