function extractID(htmlSource) {
  // Works on Vivino search page only, returns idValue of first search item

  const idPattern = /"@id":"([^"]+)"/;
  const idMatch = htmlSource.match(idPattern);
  const idValue = idMatch ? idMatch[1] : null;
  return idValue;
}

function extractRegion(htmlSource) {
  // Works on Vivino search page only, returns wine region of first search item

  const regex = /<a class="link-color-alt-grey" href="\/wine-regions[^>]*>([^<]+)<\/a>/;
  const match = htmlSource.match(regex);
  const value = match ? match[1] : null;

  return value;
}

function extractRating(htmlSource) {
  // Works on Vivino product page only, returns product ratingValue
  const ratingPattern = /"ratingValue":"([^"]+)"/;
  const ratingMatch = htmlSource.match(ratingPattern);
  return ratingMatch ? parseFloat(ratingMatch[1]) : null;
}

function extractNameFromHtmlSource() {
    // Works on Majestic wine search page only, returns productInfo
  const productElements = document.querySelectorAll('a.product-name.t-not-link');
  const majestic_names = [];
  const majestic_id = [];
  const majestic_price = [];

  //  Get all values
  productElements.forEach((element) => {
    const dataEnhancedProductClick = element.getAttribute('data-enhanced-productclick');
    if (dataEnhancedProductClick) {
      const productInfo = JSON.parse(dataEnhancedProductClick).productInfo;
      if (productInfo && productInfo.name) {
        majestic_names.push(productInfo.name);
        majestic_id.push(productInfo.id);
        majestic_price.push(productInfo.price);
      }
    }
  });

  //  Sort by majestic_price ascending
  const sortedIndex = majestic_price.map((_, index) => index).sort((a, b) => majestic_price[a] - majestic_price[b]);
  const sortedNames = sortedIndex.map((index) => majestic_names[index]);
  const sortedIds = sortedIndex.map((index) => majestic_id[index]);
  const sortedPrices = sortedIndex.map((index) => majestic_price[index]);

  return [sortedNames, sortedIds, sortedPrices];
}

 function displayProductNames() {
  const [majestic_names, majestic_id, majestic_price] = extractNameFromHtmlSource();

  if (majestic_names.length > 0) {
    const productNamesElement = document.createElement("div");
    productNamesElement.style.position = "fixed";
    productNamesElement.style.bottom = "20px";
    productNamesElement.style.right = "20px";
    productNamesElement.style.background = "#fff";
    productNamesElement.style.padding = "5px";
    productNamesElement.style.border = "1px solid #ccc";
    productNamesElement.style.maxWidth = "1000px";

    productNamesElement.textContent = `Detected ${majestic_names.length} wines:`;

    majestic_names.forEach((name, index) => {

      console.log('Processing wine number ' + index)
      console.log('Price ' + majestic_price[index]) 


      const productNameElement = document.createElement("div");

  const productName = name.replace(/[^\w\s]/g, '');
  const URL = `https://www.vivino.com/search/wines?q=${encodeURIComponent(productName)}`;

  chrome.runtime.sendMessage({ action: 'fetchHTML', website: URL}, response => {
    const ID = extractID(response)
    const Region = extractRegion(response)

    chrome.runtime.sendMessage({ action: 'fetchHTML', website: ID}, response => {
      const Rating = extractRating(response)

      // Data processing log
      console.log(majestic_id[index] + ", " + productName + ", " + 
                  majestic_price[index] + ", " + Region + ", " + Rating)
         
        const vivinoSearchLink = document.createElement("a");
        vivinoSearchLink.textContent = productName;
        vivinoSearchLink.href = ID;
        vivinoSearchLink.target = "_blank";
  
        const ratingElement = document.createElement("span");
        ratingElement.textContent = `, Rating: ${Rating}, Price: ${ majestic_price[index]}`;
  
        productNameElement.appendChild(vivinoSearchLink);
        productNameElement.appendChild(ratingElement);
        productNamesElement.appendChild(productNameElement);

      })
    })
  })
  document.body.appendChild(productNamesElement);
}
}

  console.log("Start of content script")
  displayProductNames();

    