import { Item } from "./item.js";

export class EbayFetcher {
    /**
     * Assembles an eBay search URL based on the provided options.
     * @param {Object} searchOptions - The search options to use for assembling the URL.
     * @returns {string} - The assembled eBay search URL.
     */
    static #assembleEbayURL(searchOptions) {
        let url = `https://www.ebay.co.uk/sch/i.html?_nkw=${encodeURIComponent(searchOptions.itemKeywords)}`;

        const keywordOptionsMap = {
            "All words, any order": 1,
            "Any words, exact order": 2,
            "Exact words, exact order": 3,
            "Exact words, any order": 4
        };
        if (searchOptions.keywordOptions) {
            url += `&_in_kw=${keywordOptionsMap[searchOptions.keywordOptions]}`;
        }

        if (searchOptions.titleAndDesc) {
            url += "&LH_TitleDesc=1";
        }
        if (searchOptions.completedItems) {
            url += "&LH_Complete=1";
        }
        if (searchOptions.soldItems) {
            url += "&LH_Sold=1";
        }

        url += "&_ipg=240";

        const buyingFormatMap = {
            "auction": "LH_Auction=1",
            "buy_it_now": "LH_BIN=1",
            "classified_ads": "LH_CAds=1",
            "accepts_offers": "LH_BO=1",
        };
        if (searchOptions.buyingFormat) {
            url += `&${buyingFormatMap[searchOptions.buyingFormat]}`;
        }

        const itemConditionMap = {
            "New": 3,
            "Used": 4,
            "Parts": 7000
        };
        if (searchOptions.itemCondition && searchOptions.itemCondition !== "All") {
            url += `&LH_ItemCondition=${itemConditionMap[searchOptions.itemCondition]}`;
        }

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

        url += "&_sacat=0";
        console.log(url);
        return url;
    }

    /**
     * Fetches and extracts eBay items based on the provided search options.
     * @param {Object} searchOptions - The search options to use for fetching items.
     * @returns {Promise<Item[]>} - A promise that resolves to an array of Item objects.
     */
    static async fetchEbayItems(searchOptions) {
        const originalUrl = this.#assembleEbayURL(searchOptions);
        const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(originalUrl);

        try {
            const resp = await fetch(proxyUrl);
            if (!resp.ok) {
                throw new Error(`Network response was not ok: ${resp.statusText}`);
            }

            const htmlText = await resp.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            const itemElements = Array.from(doc.querySelectorAll('.s-item'));

            const items = itemElements.slice(2).map(item => this.#extractItemData(item));
            return items;

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            return [];
        }
    }

    /**
     * Extracts item data from the given HTML element.
     * @param {Element} item - The item element from which to extract data.
     * @returns {Item} - The extracted item data.
     */
    static #extractItemData(item) {
        const titleElement = item.querySelector('.s-item__title');
        const priceElement = item.querySelector('.s-item__price');
        const conditionElement = item.querySelector('.s-item__subtitle .SECONDARY_INFO');
        const postageElement = item.querySelector('.s-item__shipping');
        const sellerElement = item.querySelector('.s-item__seller-info-text');
        const imageElement = item.querySelector('.s-item__image-wrapper img');
        const linkElement = item.querySelector('.s-item__link');
        const soldDateElement = item.querySelector('.s-item__caption--signal.POSITIVE span');

        const itemName = titleElement ? titleElement.textContent.trim() : 'No title found';
        const itemPrice = priceElement ? priceElement.textContent.trim() : 'No price found';
        const itemCondition = conditionElement ? conditionElement.textContent.trim() : 'No condition info';
        const itemPostage = postageElement ? postageElement.textContent.trim() : 'Free Postage';
        const itemSeller = sellerElement ? sellerElement.textContent.trim() : 'No seller info';
        const itemImage = imageElement ? imageElement.src : 'No image found';
        const itemLink = linkElement ? linkElement.href : 'No link found';
        const itemSoldDate = soldDateElement ? soldDateElement.textContent.trim() : null;

        return new Item(itemName, itemPrice, itemCondition, itemPostage, itemSeller, itemImage, itemLink, itemSoldDate);
    }
}
