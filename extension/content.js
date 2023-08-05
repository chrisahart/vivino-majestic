
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

        // (async () => {
            // const response = await chrome.runtime.sendMessage({greeting: "hello"});
            // do something with response here, not outside the function
            // console.log(response);
        //   })();

        chrome.runtime.sendMessage({ action: 'fetchVivinoData', productName: productName })
        
        // chrome.runtime.sendMessage({ action: 'fetchVivinoData', productName: productName }, (response) => {
        //     if (response.error) {
        //         console.log('error' + response);
        //       document.getElementById('result').textContent = `Error: ${response.error}`;
        //     } else {
        //         console.log('else' + response);
        //       document.getElementById('result').textContent = JSON.stringify(response, null, 2);
        //     }
        //   });
        // const response = await fetch(vivinoUrl);
        // const jsonData = response.json();
        // textContent does not let the attacker inject HTML elements.
        // document.getElementById("resp").textContent = jsonData;

        // chrome.runtime.sendMessage({ type: 'image', url: vivinoUrl}, response => {console.log(response)})

        //  getHtmlCodeFromUrl(vivinoUrl)
        // .then((htmlCode) => {
        //     const ratingValue = extractRatingValue(htmlCode);
        //     if (ratingValue !== null) {
        //     console.log(`Rating Value: ${ratingValue}`);
        //     } else {
        //     console.log('Rating Value not found.');
        //     }
        // })
        // .catch((error) => {
        //     console.error('Error:', error);
        // });
  
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
  