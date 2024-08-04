import { ComponentFactory } from "../components/component-factory.js";
import { EbayFetcher } from "../scraping/ebay-fetcher.js"; 
import { ItemDisplayManager } from "./item-display-manager.js";

export function initializeItemSearchForm() {
    $("#item-search-form").load("pages/evaluate/item-search-form.html", () => {
        const componentFactory = new ComponentFactory();

        const itemKeywords = componentFactory.createTextBox({
            elementId: "#item-keywords",
            parentElement: "#item-search-form",
            additionalClasses: "col-2",
            inputType: "string",
            defaultText: "",
            displayProperty: "Item Keywords",
        });

        const keywordOptions = componentFactory.createSelect({
            elementId: "#keyword-options",
            parentElement: "#item-search-form",
            additionalClasses: "col-2",
            options: ["All words, any order", "Any words, exact order", "Exact words, exact order", "Exact words, any order"],
            displayProperty: "Keyword Options",
            defaultValue: "Exact words, exact order",
        });

        const searchOptionsCheckBoxGroup = componentFactory.createCheckBoxGroup({
            groupId: "#search-options",
            parentElement: "#item-search-form",
        });

        componentFactory.createLabel({
            elementId: "#search-option-label",
            parentElement: "#search-options",
            label: "Search Including",
        });

        const titleAndDescCheckbox = searchOptionsCheckBoxGroup.addCheckBox({
            elementId: "#title-and-description-checkbox",
            label: "Title and description",
            checked: false,
        });

        const completedItemsCheckbox = searchOptionsCheckBoxGroup.addCheckBox({
            elementId: "#completed-items-checkbox",
            label: "Completed Items",
            checked: false,
        });

        const soldItemsCheckbox = searchOptionsCheckBoxGroup.addCheckBox({
            elementId: "#sold-items-checkbox",
            label: "Sold Items",
            checked: false,
        });

        const buyingRadioGroup = componentFactory.createRadioOptionGroup({
            groupId: "#buying-format-options",
            parentElement: "#item-search-form",
            name: "buyingFormat"
        });

        componentFactory.createLabel({
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

        const itemConditionOptions = componentFactory.createSelect({
            elementId: "#item-condition-options",
            parentElement: "#item-search-form",
            additionalClasses: "col-2",
            options: ["All", "New", "Used", "Parts"],
            displayProperty: "Item Condition",
        });

        const sortOptions = componentFactory.createSelect({
            elementId: "#sort-options",
            parentElement: "#item-search-form",
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

        $("#item-search-form").append('<button id="search-button" class="btn btn-primary">Search</button>');
        $("#search-button").on("click", async function () {
            const formValues = {
                itemKeywords: itemKeywords.getValue(),
                keywordOptions: keywordOptions.getValue(),
                sortOptions: sortOptions.getValue(),
                titleAndDesc: titleAndDescCheckbox.getValue(),
                completedItems: completedItemsCheckbox.getValue(),
                soldItems: soldItemsCheckbox.getValue(),
                buyingFormat: buyingRadioGroup.getValue(),
                itemCondition: itemConditionOptions.getValue(),
            };

            try {
                const ebayFetcher = new EbayFetcher(formValues);
                const items = await ebayFetcher.fetchEbayItems();
                const itemDisplayManager = new ItemDisplayManager('items-display-section', 'items-analytics-section');
                itemDisplayManager.displayItems(items);
                itemDisplayManager.displayItemAnalytics(items);

            } catch (error) {
                console.error('Error fetching eBay items:', error);
            }
        });
    });
}