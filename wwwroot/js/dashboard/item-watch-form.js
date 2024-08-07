import { EbayFetcher } from "../scraping/ebay-fetcher.js";
import { LocalStorageManager } from "../localstorage-utils.js";

export class ItemWatcher {
    #itemList;
    #storedItems;
    #localStorageManager;

    constructor() {
        this.#itemList = [];
        this.#localStorageManager = new LocalStorageManager();
        this.#storedItems = this.#getStoredItems();
    }

    #getStoredItems() {
        return this.#localStorageManager.getJsonItems("oldEbayWatch");
    }

    async addItemToWatch(searchOptions) {
        try {
            this.#itemList.push(searchOptions);

            const ebayItems = await EbayFetcher.fetchEbayItems(searchOptions);

            // Convert each eBay item to a plain object without private properties
            const items = ebayItems.map(item => item.toJSON());

            const structuredData = {
                searchOptions: searchOptions,
                items: items
            };

            console.log(structuredData);
            await this.#localStorageManager.addJsonItem("oldEbayWatch", structuredData);
        } catch (error) {
            console.error('Error fetching eBay items or adding to local storage:', error);
        }
    }

    updateItem(newItemData) {
        this.watch();
    }

    async hasItemChanged() {
        let itemChanges = [];

        for (const storedItem of this.#storedItems) {
            const { searchOptions, items: oldItems } = storedItem;
            let newItems = await EbayFetcher.fetchEbayItems(searchOptions);
            newItems = newItems.map(item => item.toJSON());

            const changes = this.#compareItems(newItems, oldItems);
            itemChanges.push({
                searchOptions: searchOptions,
                changes: changes
            });
        }

        console.log(itemChanges);
        return itemChanges;
    }

    #compareItems(newItems, oldItems) {
        const oldItemsMap = new Map(oldItems.map(item => [item.link, item]));

        const added = [];
        const removed = oldItems.filter(oldItem => !newItems.find(newItem => newItem.link === oldItem.link));
        const changed = [];

        newItems.forEach(newItem => {
            const oldItem = oldItemsMap.get(newItem.link);
            if (!oldItem) {
                added.push(newItem);
            } else if (!this.#isEqual(newItem, oldItem)) {
                changed.push(newItem);
            }
        });

        return { added, removed, changed };
    }

    #isEqual(item1, item2) {
        return item1.name === item2.name &&
            item1.price === item2.price &&
            item1.condition === item2.condition &&
            item1.postage === item2.postage &&
            item1.seller === item2.seller;
    }
}
