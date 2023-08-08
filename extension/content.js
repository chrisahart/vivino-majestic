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

  return [majestic_names, majestic_id, majestic_price];
}

async function displayProductNames() {
  const [majestic_names, majestic_id, majestic_price] = extractNameFromHtmlSource();

  if (majestic_names.length > 0) {
    const productTable = document.createElement("table");
    productTable.style.borderCollapse = "collapse";
    productTable.style.width = "100%";

    // Table header
    const headerRow = document.createElement("tr");
    const headerNames = ["Product Name", "Rating", "Price", "Region"];
    headerNames.forEach((headerName) => {
      const th = document.createElement("th");
      th.style.border = "1px solid #ccc";
      th.textContent = headerName;
      headerRow.appendChild(th);
    });
    productTable.appendChild(headerRow);

    // Helper function to fetch data for each wine and add it to the table
    async function processWine(index) {
      const productName = majestic_names[index].replace(/[^\w\s]/g, '');
      const URL = `https://www.vivino.com/search/wines?q=${encodeURIComponent(productName)}`;

      const response = await new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'fetchHTML', website: URL }, resolve);
      });

      const ID = extractID(response);
      const Region = extractRegion(response);

      const responseRating = await new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'fetchHTML', website: ID }, resolve);
      });

      const Rating = extractRating(responseRating);

      const row = document.createElement("tr");

      const productNameCell = document.createElement("td");
      const productNameLink = document.createElement("a");
      productNameLink.textContent = productName;
      productNameLink.href = ID;
      productNameLink.target = "_blank"; // Opens the link in a new tab
      productNameCell.appendChild(productNameLink);
      productNameCell.style.border = "1px solid #ccc";

      const ratingCell = document.createElement("td");
      ratingCell.textContent = Rating ? Rating.toFixed(2) : 'N/A';
      ratingCell.style.border = "1px solid #ccc";

      const priceCell = document.createElement("td");
      priceCell.textContent = majestic_price[index];
      priceCell.style.border = "1px solid #ccc";

      const regionCell = document.createElement("td");
      regionCell.textContent = Region ? Region : 'N/A';
      regionCell.style.border = "1px solid #ccc";

      row.appendChild(productNameCell);
      row.appendChild(ratingCell);
      row.appendChild(priceCell);
      row.appendChild(regionCell);
      productTable.appendChild(row);
    }

    // Process wines in order and add them to the table
    for (let i = 0; i < majestic_names.length; i++) {
      await processWine(i);
    }

    const productNamesElement = document.createElement("div");
    productNamesElement.style.position = "fixed";
    productNamesElement.style.bottom = "20px";
    productNamesElement.style.right = "20px";
    productNamesElement.style.background = "#fff";
    productNamesElement.style.padding = "5px";
    productNamesElement.style.border = "1px solid #ccc";
    productNamesElement.style.maxWidth = "1000px";

    productNamesElement.appendChild(productTable);
    document.body.appendChild(productNamesElement);
  }
}


  console.log("Start of content script")
  displayProductNames();
  console.log("End of content script")
    