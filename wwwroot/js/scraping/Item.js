export class Item {
    #name;
    #price;
    #condition;
    #postage;
    #seller;
    #imageUrl;
    #link;
    #soldDate;

    constructor(name, price, condition, postage, seller, imageUrl, link, soldDate = null) {
        this.#name = name;
        this.#price = price;
        this.#condition = condition;
        this.#postage = postage;
        this.#seller = seller;
        this.#imageUrl = imageUrl;
        this.#link = link;
        this.#soldDate = soldDate;
    }

    getName() {
        return this.#name;
    }

    getPrice() {
        return this.#price;
    }

    getCondition() {
        return this.#condition;
    }

    getPostage() {
        return this.#postage;
    }

    getSeller() {
        return this.#seller;
    }

    getImageUrl() {
        return this.#imageUrl;
    }

    getLink() {
        return this.#link;
    }

    getSoldDate() {
        return this.#soldDate;
    }

    static #parsePrice(priceStr) {
        return parseFloat(priceStr.replace(/[^0-9.-]+/g, ""));
    }

    getTotalPrice() {
        const itemPrice = Item.#parsePrice(this.#price);
        const postagePrice = this.#postage.toLowerCase().includes('free') ? 0 : Item.#parsePrice(this.#postage);
        return itemPrice + postagePrice;
    }

    toJSON() {
        return {
            name: this.getName(),
            price: this.getPrice(),
            condition: this.getCondition(),
            postage: this.getPostage(),
            seller: this.getSeller(),
            imageUrl: this.getImageUrl(),
            link: this.getLink(),
            soldDate: this.getSoldDate()
        };
    }
}