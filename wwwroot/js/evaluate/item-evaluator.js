import { ComponentFactory } from "../components/component-factory.js";
import { EbayFetcher } from "../scraping/ebay-fetcher.js";
import { ItemDisplayManager } from "./item-display-manager.js";
import { ItemWatcher } from "../dashboard/item-watcher.js";

export class ItemEvaluator {
    #formId;
    #componentFactory;
    #itemKeywords;
    #keywordOptions;
    #searchOptionsCheckBoxGroup;
    #titleAndDescCheckbox;
    #completedItemsCheckbox;
    #soldItemsCheckbox;
    #buyingRadioGroup;
    #itemConditionOptions;
    #sortOptions;

    constructor(formId) {
        this.#formId = formId;
    }

    initialize() {
        $(`#${this.#formId}`).load("pages/evaluate/item-search-form.html", () => {
            this.#componentFactory = new ComponentFactory();

            this.#itemKeywords = this.#createItemKeywords();
            this.#keywordOptions = this.#createKeywordOptions();
            this.#searchOptionsCheckBoxGroup = this.#createSearchOptionsCheckBoxGroup();
            this.#titleAndDescCheckbox = this.#createTitleAndDescCheckbox();
            this.#completedItemsCheckbox = this.#createCompletedItemsCheckbox();
            this.#soldItemsCheckbox = this.#createSoldItemsCheckbox();
            this.#buyingRadioGroup = this.#createBuyingRadioGroup();
            this.#itemConditionOptions = this.#createItemConditionOptions();
            this.#sortOptions = this.#createSortOptions();

            this.#appendButtons();
            this.#setupEventListeners();
        });
    }

    #createItemKeywords() {
        return this.#componentFactory.createTextBox({
            elementId: "#item-keywords",
            parentElement: `#${this.#formId}`,
            additionalClasses: "col-2",
            inputType: "string",
            defaultText: "",
            displayProperty: "Item Keywords",
        });
    }

    #createKeywordOptions() {
        return this.#componentFactory.createSelect({
            elementId: "#keyword-options",
            parentElement: `#${this.#formId}`,
            additionalClasses: "col-2",
            options: ["All words, any order", "Any words, exact order", "Exact words, exact order", "Exact words, any order"],
            displayProperty: "Keyword Options",
            defaultValue: "Exact words, exact order",
        });
    }

    #createSearchOptionsCheckBoxGroup() {
        const searchOptionsCheckBoxGroup = this.#componentFactory.createCheckBoxGroup({
            groupId: "#search-options",
            parentElement: `#${this.#formId}`,
        });

        this.#componentFactory.createLabel({
            elementId: "#search-option-label",
            parentElement: "#search-options",
            label: "Search Including",
        });

        return searchOptionsCheckBoxGroup;
    }

    #createTitleAndDescCheckbox() {
        return this.#searchOptionsCheckBoxGroup.addCheckBox({
            elementId: "#title-and-description-checkbox",
            label: "Title and description",
            checked: false,
        });
    }

    #createCompletedItemsCheckbox() {
        return this.#searchOptionsCheckBoxGroup.addCheckBox({
            elementId: "#completed-items-checkbox",
            label: "Completed Items",
            checked: false,
        });
    }

    #createSoldItemsCheckbox() {
        return this.#searchOptionsCheckBoxGroup.addCheckBox({
            elementId: "#sold-items-checkbox",
            label: "Sold Items",
            checked: false,
        });
    }

    #createBuyingRadioGroup() {
        const buyingRadioGroup = this.#componentFactory.createRadioOptionGroup({
            groupId: "#buying-format-options",
            parentElement: `#${this.#formId}`,
            name: "buyingFormat"
        });

        this.#componentFactory.createLabel({
            elementId: "#buying-format-radio-group-label",
            parentElement: "#buying-format-options",
            label: "Buying Format",
        });

        buyingRadioGroup.addRadioOption({
            elementId: "#buying-format-option-all",
            label: "All",
            value: "all",
            checked: false,
        });

        buyingRadioGroup.addRadioOption({
            elementId: "#buying-format-option-accepts-offers",
            label: "Accepts Offers",
            value: "accepts_offers",
            checked: false,
        });

        buyingRadioGroup.addRadioOption({
            elementId: "#buying-format-option-auction",
            label: "Auction",
            value: "auction",
            checked: false,
        });

        buyingRadioGroup.addRadioOption({
            elementId: "#buying-format-option-buy-it-now",
            label: "Buy It Now",
            value: "buy_it_now",
            checked: false,
        });

        buyingRadioGroup.addRadioOption({
            elementId: "#buying-format-option-classified-ads",
            label: "Classified Ads",
            value: "classified_ads",
            checked: false,
        });

        return buyingRadioGroup;
    }

    #createItemConditionOptions() {
        return this.#componentFactory.createSelect({
            elementId: "#item-condition-options",
            parentElement: `#${this.#formId}`,
            additionalClasses: "col-2",
            options: ["All", "New", "Used", "Parts"],
            displayProperty: "Item Condition",
        });
    }

    #createSortOptions() {
        return this.#componentFactory.createSelect({
            elementId: "#sort-options",
            parentElement: `#${this.#formId}`,
            additionalClasses: "col-3",
            options: [
                "Time: ending soonest",
                "Time: newly listed",
                "Price + postage: lowest first",
                "Price + postage: highest first",
                "Price: lowest first",
                "Price: highest first",
                "Best match"
            ],
            displayProperty: "Sort by",
        });
    }

    #appendButtons() {
        $(`#${this.#formId}`).append('<button id="search-button" class="btn btn-primary">Search</button>');
        $(`#${this.#formId}`).append('<button id="watcher-button" class="btn btn-primary">Add To Watch</button>');
    }

    #setupEventListeners() {
        $("#watcher-button").click(() => {
            const formValues = this.#getFormValues();
            const itemWatcher = new ItemWatcher();
            itemWatcher.addItemToWatch(formValues);
        });

        $("#search-button").on("click", async () => {
            const formValues = this.#getFormValues();

            try {
                const items = await EbayFetcher.fetchEbayItems(formValues);
                const itemDisplayManager = new ItemDisplayManager('items-display-section', 'items-analytics-section');
                itemDisplayManager.displayItems(items);
                itemDisplayManager.displayItemAnalytics(items);
            } catch (error) {
                console.error('Error fetching eBay items:', error);
                alert("Invalid Search Term or CORS Proxy");
            }
        });
    }

    #getFormValues() {
        return {
            itemKeywords: this.#itemKeywords.getValue(),
            keywordOptions: this.#keywordOptions.getValue(),
            sortOptions: this.#sortOptions.getValue(),
            titleAndDesc: this.#titleAndDescCheckbox.getValue(),
            completedItems: this.#completedItemsCheckbox.getValue(),
            soldItems: this.#soldItemsCheckbox.getValue(),
            buyingFormat: this.#buyingRadioGroup.getValue(),
            itemCondition: this.#itemConditionOptions.getValue(),
        };
    }
}

