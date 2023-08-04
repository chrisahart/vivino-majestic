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
  
  function displayProductNames() {
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
  
      products.forEach((product) => {
        const productNameElement = document.createElement("div");
        productNameElement.textContent = `${product.name}`;
        productNamesElement.appendChild(productNameElement);
      });
  
      document.body.appendChild(productNamesElement);
    }
  }
  
  displayProductNames();