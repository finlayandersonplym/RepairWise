import { ComponentFactory } from "../components/componentFactory.js";
import { fetchEbayItems } from "../scraping/getEbayData.js";

export function initializeItemSearchForm() {
    $("#item-search-form").load("pages/evaluate/item-search-form.html", () => {
        // Create a ComponentFactory instance
        const componentFactory = new ComponentFactory(2);

        // Create a TextBox
        const itemKeywords = componentFactory.createTextBox({
            elementId: "#item-keywords",
            parentElement: "#item-search-form",
            additionalClasses: "col-2",
            inputType: "string",
            defaultText: "",
            displayProperty: "Item Keywords",
        });

        // Create a Select
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

        // Add a label to the checkbox group
        componentFactory.createLabel({
            elementId: "#search-option-label",
            parentElement: "#search-options",
            label: "Search Including",
        });

        // Add checkboxes to the group

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

        // Add radio buttons to the group

        buyingRadioGroup.addRadioOption({
            elementId: "#buying-format-option-all",
            label: "All",
            value: "all",
            checked: false,
        });

        // Add radio buttons to the group
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

        // Change this later for component factory
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
                const items = await fetchEbayItems(formValues);
                displayItems(items);
                displayItemAnalytics(items)

            } catch (error) {
                console.error('Error fetching eBay items:', error);
            }
        });

    });
}

function displayItems(items) {
    const itemsDisplaySection = document.getElementById('items-display-section');
    itemsDisplaySection.innerHTML = ''; // Clear any existing items

    items.forEach(item => {

        //Ebays image render just allows to me to edit the suffix of the img link to make it upscaled
        const updatedImageUrl = item.imageUrl.replace(/l140|l500/, 'l1000');

        const itemHTML = `
            <div class="item-card">
                <div class="item-image">
                    <img src="${updatedImageUrl}" alt="${item.name}" />
                </div>
                <div class="item-details">
                    <a class="item-title" href="${item.link}" target="_blank">
                        <h3>${item.name}</h3>
                    </a>
                    <p class="item-price"><strong>Price:</strong> ${item.price}</p>
                    <p class="item-condition"><strong>Condition:</strong> ${item.condition}</p>
                    <p class="item-postage"><strong>Postage:</strong> ${item.postage}</p>
                    <p class="item-seller"><strong>Seller:</strong> ${item.seller}</p>
                      ${item.soldDate ? `<p class="item-sold-date"><strong>Sold Date:</strong> ${item.soldDate}</p>` : ''}
                </div>
            </div>
        `;
        itemsDisplaySection.innerHTML += itemHTML;
    });
}

function displayItemAnalytics(items) {
    const itemsAnalyticsSection = document.getElementById('items-analytics-section');
    itemsAnalyticsSection.innerHTML = ''; // Clear any existing analytics

    // Helper function to parse price strings
    const parsePrice = (priceStr) => parseFloat(priceStr.replace(/[^0-9.-]+/g, ""));

    // Calculate statistics
    const totalItems = items.length;
    const prices = items.map(item => {
        const itemPrice = parsePrice(item.price);
        const postagePrice = item.postage.toLowerCase().includes('free') ? 0 : parsePrice(item.postage);
        return itemPrice + postagePrice;
    });

    const averagePrice = (prices.reduce((sum, price) => sum + price, 0) / totalItems).toFixed(2);
    const minPrice = Math.min(...prices).toFixed(2);
    const maxPrice = Math.max(...prices).toFixed(2);
    const medianPrice = (prices.sort((a, b) => a - b)[Math.floor(totalItems / 2)]).toFixed(2);

    const conditionStats = items.reduce((acc, item) => {
        const totalPrice = parsePrice(item.price) + (item.postage.toLowerCase().includes('free') ? 0 : parsePrice(item.postage));
        if (!acc[item.condition]) {
            acc[item.condition] = { count: 0, total: 0 };
        }
        acc[item.condition].count += 1;
        acc[item.condition].total += totalPrice;
        return acc;
    }, {});

    const uniqueSellers = [...new Set(items.map(item => item.seller))].length;
    const freePostageCount = items.filter(item => item.postage.toLowerCase().includes('free')).length;
    const freePostagePercentage = ((freePostageCount / totalItems) * 100).toFixed(2);

    // Generate HTML for statistics
    const statsHTML = `
        <div class="analytics-card">
            <h3>Item Analytics</h3>
            <div class="analytics-item">
                <p><strong>Total Items:</strong> ${totalItems}</p>
            </div>
            <div class="analytics-item">
                <p><strong>Average Price (Including Postage):</strong> &pound;${averagePrice}</p>
                <p><strong>Minimum Price (Including Postage):</strong> &pound;${minPrice}</p>
                <p><strong>Maximum Price (Including Postage):</strong> &pound;${maxPrice}</p>
                <p><strong>Median Price (Including Postage):</strong> &pound;${medianPrice}</p>
            </div>
            <div class="analytics-item">
                <p><strong>Unique Sellers:</strong> ${uniqueSellers}</p>
            </div>
            <div class="analytics-item">
                <p><strong>Free Postage:</strong> ${freePostagePercentage}%</p>
            </div>
            <div class="analytics-item">
                <h4>Condition Distribution:</h4>
                <ul class="condition-list">
                    ${Object.keys(conditionStats).map(condition => {
        const averageConditionPrice = (conditionStats[condition].total / conditionStats[condition].count).toFixed(2);
        return `<li>${condition}: ${conditionStats[condition].count} (Average Price: &pound;${averageConditionPrice})</li>`;
    }).join('')}
                </ul>
            </div>
            <div"><canvas id="canvas"></canvas></div>
        </div>
    `;
    itemsAnalyticsSection.innerHTML = statsHTML;

    const soldItems = items.filter(item => item.soldDate);
    const labels = soldItems.map(item => item.soldDate.replace('Sold ', ''));
    const data = soldItems.map(item => parseFloat(item.price.replace(/[^0-9.-]+/g, "")));


    itemGraph(labels, data);
}

function itemGraph(labels, data) {

    new Chart(
        document.getElementById('canvas'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Sold Items Price',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date Sold'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

