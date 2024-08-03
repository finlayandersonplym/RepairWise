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

export async function fetchEbayItems(searchOptions) {
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
        const itemElements = Array.from(doc.querySelectorAll('.s-item'));

        // Array to store the extracted items
        const items = [];

        // Ignore the first two items and extract name and price for each remaining item
        itemElements.slice(2).forEach(item => {
            const titleElement = item.querySelector('.s-item__title');
            const priceElement = item.querySelector('.s-item__price');
            const conditionElement = item.querySelector('.s-item__subtitle .SECONDARY_INFO');
            const postageElement = item.querySelector('.s-item__shipping');
            const sellerElement = item.querySelector('.s-item__seller-info-text');
            const imageElement = item.querySelector('.s-item__image-wrapper img');
            const linkElement = item.querySelector('.s-item__link');
            const soldDateElement = item.querySelector('.s-item__caption--signal.POSITIVE span');

            // Extract and clean up the data
            const itemName = titleElement ? titleElement.textContent.trim() : 'No title found';
            const itemPrice = priceElement ? priceElement.textContent.trim() : 'No price found';
            const itemCondition = conditionElement ? conditionElement.textContent.trim() : 'No condition info';
            const itemPostage = postageElement ? postageElement.textContent.trim() : 'Free Postage';
            const itemSeller = sellerElement ? sellerElement.textContent.trim() : 'No seller info';
            const itemImage = imageElement ? imageElement.src : 'No image found';
            const itemLink = linkElement ? linkElement.href : 'No link found';
            const itemSoldDate = soldDateElement ? soldDateElement.textContent.trim() : null;

            // Create an item object and add it to the items array
            const itemObject = {
                name: itemName,
                price: itemPrice,
                condition: itemCondition,
                postage: itemPostage,
                seller: itemSeller,
                imageUrl: itemImage,
                link: itemLink,
                soldDate: itemSoldDate,
            };

            items.push(itemObject);
        });

        // Return the list of items
        return items;

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return [];  // Return an empty array in case of an error
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

function assembleEbayURL(searchOptions) {
    let url = `https://www.ebay.co.uk/sch/i.html?_nkw=${encodeURIComponent(searchOptions.itemKeywords)}`;

    // Keyword options (mutually exclusive)
    const keywordOptionsMap = {
        "All words, any order": 1,
        "Any words, exact order": 2,
        "Exact words, exact order": 3,
        "Exact words, any order": 4
    };
    if (searchOptions.keywordOptions) {
        url += `&_in_kw=${keywordOptionsMap[searchOptions.keywordOptions]}`;
    }

    // Non-mutually exclusive options
    if (searchOptions.titleAndDesc) {
        url += "&LH_TitleDesc=1";
    }
    if (searchOptions.completedItems) {
        url += "&LH_Complete=1";
    }
    if (searchOptions.soldItems) {
        url += "&LH_Sold=1";
    }

    // Buying format (mutually exclusive)
    const buyingFormatMap = {
        "auction": "LH_Auction=1",
        "buy_it_now": "LH_BIN=1",
        "classified_ads": "LH_CAds=1",
        "accepts_offers": "LH_BO=1",
    };
    if (searchOptions.buyingFormat) {
        url += `&${buyingFormatMap[searchOptions.buyingFormat]}`;
    }

    // Item condition (mutually exclusive)
    const itemConditionMap = {
        "New": 3,
        "Used": 4,
        "Parts": 7000
    };
    if (searchOptions.itemCondition && searchOptions.itemCondition !== "All") {
        url += `&LH_ItemCondition=${itemConditionMap[searchOptions.itemCondition]}`;
    }

    // Sort options (mutually exclusive)
    const sortOptionsMap = {
        "Time: ending soonest": 1,
        "Time: newly listed": 10,
        "Price + postage: lowest first": 15,
        "Price + postage: highest first": 16,
        "Price: lowest first": 2,
        "Price: highest first": 3,
        "Best match": 12
    };
    if (searchOptions.sortOptions) {
        url += `&_sop=${sortOptionsMap[searchOptions.sortOptions]}`;
    }

    url += "&_sacat=0"; // Category is hardcoded to 0 (all categories)
    console.log(url);
    return url;
}
