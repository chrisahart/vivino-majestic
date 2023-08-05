function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getInvTagManagerParams() {
    const scripts = document.getElementsByTagName("script");
    let invTagManagerParamsValue = null;
  
    for (let i = 0; i < scripts.length; i++) {
      const script = scripts[i];
      const scriptContent = script.textContent;
      if (scriptContent.includes("var invTagManagerParams")) {
        const startIndex = scriptContent.indexOf("var invTagManagerParams");
        const endIndex = scriptContent.indexOf(";", startIndex);
        if (startIndex !== -1 && endIndex !== -1) {
          invTagManagerParamsValue = scriptContent.slice(startIndex, endIndex + 1);
          break;
        }
      }
    }
  
    return invTagManagerParamsValue;
  }
  
  function findInvTagManagerParams() {
    const invTagManagerParamsValue = getInvTagManagerParams();
    const regex = /"ProductDataLayer":\s*(\[.*?\])/s;
    const match = invTagManagerParamsValue.match(regex);
  
    if (match && match[1]) {
      return JSON.parse(match[1]);
    } else {
      return [];
    }
  }


   function getRating(productName) {
    const temp = chrome.runtime.sendMessage({ action: 'fetchVivinoData', productName: productName });
    return temp;
  }
  
  async function displayProductNames() {
    const products = findInvTagManagerParams();
  
    if (products.length > 0) {
      const productNamesElement = document.createElement("div");
      productNamesElement.style.position = "fixed";
      productNamesElement.style.bottom = "20px";
      productNamesElement.style.right = "20px";
      productNamesElement.style.background = "#fff";
      productNamesElement.style.padding = "5px";
      productNamesElement.style.border = "1px solid #ccc";
      productNamesElement.style.maxWidth = "1000px";
  
      productNamesElement.textContent = `Detected ${products.length} wines:`;
  
      for (const product of products) {
        const productNameElement = document.createElement("div");
        const productName = product.name;
        const vivinoUrl = `https://www.vivino.com/search/wines?q=${encodeURIComponent(productName)}`;
  
        //  Fetch the rating value for each wine from vivino.com
        ratingValue = 1;
        console.log('ratingValue ' + ratingValue);

        const ratingValue_new = getRating(productName)
        console.log('ratingValue_new ' + ratingValue_new);
        
          // Sleep for 1 s to avoid sending too many requests to Vivino
          await sleep(1000);
          
          console.log('ratingValue ' + ratingValue);
  
        const vivinoSearchLink = document.createElement("a");
        vivinoSearchLink.textContent = productName;
        vivinoSearchLink.href = vivinoUrl;
        vivinoSearchLink.target = "_blank";
  
        const ratingElement = document.createElement("span");
        ratingElement.textContent = ` - Rating: ${ratingValue}`;
  
        productNameElement.appendChild(vivinoSearchLink);
        productNameElement.appendChild(ratingElement);
        productNamesElement.appendChild(productNameElement);
      }
  
      document.body.appendChild(productNamesElement);
    }
  }
  
  console.log("Hello from content script")
  displayProductNames();