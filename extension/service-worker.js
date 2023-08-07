console.log("Hello from background script");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function func_fetchHTML(url) {
  try {
    const response = await fetch(url);
    const htmlSource = await response.text();
    return htmlSource;
  } catch (error) {
    console.error("Error fetching HTML:", error);
    return null;
  }
}

 async function func_extractRatingValue(htmlSource) {
  const regex = /{"@context":"http:\/\/schema.org\/","@type":"Product",.*?"ratingValue":(.*?),"reviewCount":.*?}/g;
  const match = regex.exec(htmlSource);
  if (match && match.length > 1) {
    return parseFloat(match[1]);
  }
  return null;
}

async function func_fetchVivinoData(productName) {
  const vivinoUrl = `https://www.vivino.com/search/wines?q=${encodeURIComponent(productName)}`;
  const htmlSource = await func_fetchHTML(vivinoUrl);
  const ratingValue = await func_extractRatingValue(htmlSource);
//   await sleep(1000);
  return ratingValue;
}

chrome.runtime.onMessage.addListener( async function (request, sender, sendResponse) {
  if (request.action === 'fetchVivinoData') {

    const ratingValue = await func_fetchVivinoData(request.productName);
    console.log("Wine " + request.productName, "score is  " + ratingValue);
    sendResponse({ fetchVivinoData: ratingValue });

    // (async () => {

    // var ratingValue = 1

    // const ratingValue_temp =  func_fetchVivinoData(request.productName);
    // ratingValue_temp.then(function(temp) {
        // console.log('value ' + temp);
        // ratingValue = temp
        // console.log('ratingValue ' + ratingValue);
        // for(var property in value.fetchVivinoData) {
        //     alert(property + "=" + value.fetchVivinoData[property]);
        // }
    //   });

    //   console.log('ratingValue ' + ratingValue);
    //  
    // console.log("Wine " + request.productName, "score is  " + ratingValue);
    // sendResponse({ fetchVivinoData: ratingValue });

    return true;

        // const ratingValue = await func_fetchVivinoData(request.productName);
        // const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
        // const response = await chrome.tabs.sendMessage(tab.id, {greeting: "hello"});
        // do something with response here, not outside the function
        // console.log(response);
    //   })();

  }
  
});
