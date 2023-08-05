console.log("Hello from background script");

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

function func_extractRatingValue(htmlSource) {
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
  const ratingValue = func_extractRatingValue(htmlSource);
//   console.log("Wine " + productName, "score is  " + ratingValue);
  return ratingValue;
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {

  if (request.action === 'fetchVivinoData') {
    const ratingValue = await func_fetchVivinoData(request.productName);
    console.log("Wine " + request.productName, "score is  " + ratingValue);
    sendResponse({ fetchVivinoData: ratingValue });
    
  }
});
