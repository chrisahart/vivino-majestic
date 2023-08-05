import './sw-omnibox.js';
import './sw-tips.js';

console.log("Hello from background script")

async function fetchHTML(url) {

    try {
        const response = await fetch(url);
        const htmlSource = await response.text();
        return htmlSource;
      } catch (error) {
        console.error("Error fetching HTML:", error);
        return null;
      }

    // console.log("url is " + url)
    // const ratingValue = 1 

    // fetch(url)
    // .then(function (response) { return response.text();})
    // .then(function (text) {
    // console.log(text.length);
    //   const ratingValue = extractRatingValue(text);
    //   console.log("ratingValue is " + ratingValue);
    // });

    // return ratingValue
  }

  // Function to extract the ratingValue from the JSON data
function extractRatingValue(htmlSource) {
    const regex = /{"@context":"http:\/\/schema.org\/","@type":"Product",.*?"ratingValue":(.*?),"reviewCount":.*?}/g;
    const match = regex.exec(htmlSource);
    if (match && match.length > 1) {
      return parseFloat(match[1]);
    }
    return null;
  }

// Define a function to fetch data from a URL
async function fetchVivinoData(productName) {

        const ratingValue = 1
        const vivinoUrl = `https://www.vivino.com/search/wines?q=${encodeURIComponent(productName)}`;
        const htmlSource = await fetchHTML(vivinoUrl);

  if (htmlSource) {
         const ratingValue = extractRatingValue(htmlSource);
         console.log("Wine " + productName, "score is  " + ratingValue)
    // console.log(htmlSource); // Output the fetched HTML source
    // You can perform any operations with the HTML source here
  }

    // console.log("Start of function fetchVivinoData")
    // const vivinoUrl = `https://www.vivino.com/search/wines?q=${encodeURIComponent(productName)}`;
    // console.log("vivinoUrl is " + vivinoUrl)

    // //  Fetch the rating value for wine from vivinoUrl
    // const ratingValue = fetchData(vivinoUrl);
    // console.log('Obtained rating' + ratingValue)

    return ratingValue

    // try {
    //   const response = await fetch(vivinoUrl, { mode: 'cors' });
  
    //   if (!response.ok) {
    //     console.log("Network response was not ok")
    //     throw new Error('Network response was not ok');
    //   }
  
    //   const data = await response.json();
    //   return data;
    // } catch (error) {
    //   console.error('Error fetching data:', error);
    //   return null;
    // }
  }
  
  // Listen for messages from content scripts (or other parts of the extension)
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fetchVivinoData') {

      const productName = request.productName;
      const ratingValue = fetchVivinoData(productName)
      
      return true;
    }
  });

// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {

//     //   console.log(sender.tab ?
//     //               "from a content script:" + sender.tab.url :
//     //               "from the extension");

//       if (request.greeting === "hello")
//         sendResponse({farewell: "goodbye"});
//     }
//   );