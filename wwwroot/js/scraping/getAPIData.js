/**
 * @typedef {Object} SearchOptions
 * @property {string} [itemKeywords]
 * @property {"All words, any order" | "Any words, exact order" | "Exact words, exact order" | "Exact words, any order"} [keywordOptions]
 * @property {boolean} [completedItems]
 * @property {boolean} [soldItems]
 * @property {boolean} [titleAndDesc]
 * @property {"accepts_offers" | "auction" | "buy_it_now" | "classified_ads"} [buyingFormat]
 * @property {"Time: ending soonest" | "Time: newly listed" | "Price + postage: lowest first" | "Price + postage: highest first" | "Price: highest first" | "Price: lowest first" | "Best match"} [sortOptions]
 */

/**
 * Fetches and extracts eBay items based on the provided search options.
 * @param {SearchOptions} searchOptions - The options for constructing the search URL.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */

export async function fetch_and_extract_ebay_items(searchOptions) {

    // This code is important to adhere to Ebay's CORS policy, using the corsproxy https://corsproxy.io/
    const originalUrl = assembleEbayURL(searchOptions);
    const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(originalUrl);

    try {
        const resp = await fetch(proxyUrl);
        if (!resp.ok) {
            throw new Error('Network response was not ok');
        }

        const htmlText = await resp.text();

        // Parse the HTML response using DOMParser
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        // Query for item elements, finds all items on the given page
        const itemElements = doc.querySelectorAll('.s-item');

        // Extract name and price for each item
        itemElements.forEach(item => {
            const titleElement = item.querySelector('.s-item__title');
            const priceElement = item.querySelector('.s-item__price');
            const conditionElement = item.querySelector('.s-item__subtitle .SECONDARY_INFO');
            const postageElement = item.querySelector('.s-item__shipping');
            const sellerElement = item.querySelector('.s-item__seller-info-text');
            const imageElement = item.querySelector('.s-item__image-wrapper img');
            const linkElement = item.querySelector('.s-item__link');

            // Extract and clean up the data
            const itemName = titleElement ? titleElement.textContent.trim() : 'No title found';
            const itemPrice = priceElement ? priceElement.textContent.trim() : 'No price found';
            const itemCondition = conditionElement ? conditionElement.textContent.trim() : 'No condition info';
            const itemPostage = postageElement ? postageElement.textContent.trim() : 'Free Postage';
            const itemSeller = sellerElement ? sellerElement.textContent.trim() : 'No seller info';
            const itemImage = imageElement ? imageElement.src : 'No image found';
            const itemLink = linkElement ? linkElement.href : 'No link found';

            // Log the extracted information
            console.log(`Name: ${itemName}`);
            console.log(`Price: ${itemPrice}`);
            console.log(`Condition: ${itemCondition}`);
            console.log(`Postage: ${itemPostage}`);
            console.log(`Seller: ${itemSeller}`);
            console.log(`Image URL: ${itemImage}`);
            console.log(`Link: ${itemLink}`);
            console.log('--------------------------------');
        });
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}


// Stuff like typescript would be really useful here to define searchOptions, instead I just have to use a JSDoc so it's just implied :( at least Visual Studio can read it

/**
 * @typedef {Object} SearchOptions
 * @property {string} [itemKeywords]
 * @property {"All words, any order" | "Any words, exact order" | "Exact words, exact order" | "Exact words, any order"} [keywordOptions]
 * @property {boolean} [completedItems]
 * @property {boolean} [soldItems]
 * @property {boolean} [titleAndDesc]
 * @property {"accepts_offers" | "auction" | "buy_it_now" | "classified_ads"} [buyingFormat]
 * @property {"Time: ending soonest" | "Time: newly listed" | "Price + postage: lowest first" | "Price + postage: highest first" | "Price: highest first" | "Price: lowest first" | "Best match"} [sortOptions]
 */

/**
 * Assembles an eBay search URL based on the provided options.
 * @param {SearchOptions} searchOptions - The options for constructing the search URL.
 * @returns {string} - The assembled eBay search URL.
 */

export function assembleEbayURL(searchOptions) {
    const baseURL = "https://www.ebay.co.uk/sch/i.html?_nkw=";
    let url = baseURL;

    // Add keywords
    if (searchOptions.itemKeywords) {
        url += encodeURIComponent(searchOptions.itemKeywords);
    }

    // Keyword options (mutually exclusive)
    const keywordOptionsMap = {
        "All words, any order": 1,
        "Any words, exact order": 2,
        "Exact words, exact order": 3,
        "Exact words, any order": 4,
    };
    if (searchOptions.keywordOptions && keywordOptionsMap[searchOptions.keywordOptions]) {
        url += `&_in_kw=${keywordOptionsMap[searchOptions.keywordOptions]}`;
    }

    // Add common part
    url += "&_sacat=0";

    // Add completed and sold items (not mutually exclusive)
    if (searchOptions.completedItems) {
        url += "&LH_Complete=1";
    }
    if (searchOptions.soldItems) {
        url += "&LH_Sold=1";
    }

    // Add title and description
    if (searchOptions.titleAndDesc) {
        url += "&LH_TitleDesc=1";
    }

    // Buying format options (mutually exclusive)
    const buyingFormatMap = {
        "accepts_offers": "LH_BO=1",
        "auction": "LH_Auction=1",
        "buy_it_now": "LH_BIN=1",
        "classified_ads": "LH_CAds=1"
    };

    if (searchOptions.buyingFormat && buyingFormatMap[searchOptions.buyingFormat]) {
        url += `&${buyingFormatMap[searchOptions.buyingFormat]}`;
    }

    // Sort options (mutually exclusive)
    const sortOptionsMap = {
        "Time: ending soonest": 1,
        "Time: newly listed": 10,
        "Price + postage: lowest first": 15,
        "Price + postage: highest first": 16,
        "Price: highest first": 3,
        "Price: lowest first": 2,
        "Best match": 12,
    };
    if (searchOptions.sortOptions && sortOptionsMap[searchOptions.sortOptions]) {
        url += `&_sop=${sortOptionsMap[searchOptions.sortOptions]}`;
    }

    return url;
}