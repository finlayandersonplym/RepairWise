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
            const items = ebayItems.slice(4).map(item => item.toJSON());

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

            console.log(oldItems);
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
            } else {
                const itemChanges = this.#getChanges(oldItem, newItem);
                if (Object.keys(itemChanges).length > 0) {
                    changed.push({ link: newItem.link, changes: itemChanges });
                }
            }
        });

        return { added, removed, changed };
    }

    #getChanges(oldItem, newItem) {
        const changes = {};
        if (oldItem.name !== newItem.name) changes.name = { old: oldItem.name, new: newItem.name };
        if (oldItem.price !== newItem.price) changes.price = { old: oldItem.price, new: newItem.price };
        if (oldItem.condition !== newItem.condition) changes.condition = { old: oldItem.condition, new: newItem.condition };
        if (oldItem.postage !== newItem.postage) changes.postage = { old: oldItem.postage, new: newItem.postage };
        if (oldItem.seller !== newItem.seller) changes.seller = { old: oldItem.seller, new: newItem.seller };
        return changes;
    }
}
