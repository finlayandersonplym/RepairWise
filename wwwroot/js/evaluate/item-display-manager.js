import { ChartManager } from "../charts/chart-manager.js";

export class ItemDisplayManager {
    #itemsDisplaySection;
    #itemsAnalyticsSection;

    constructor(itemsDisplaySectionId, itemsAnalyticsSectionId) {
        this.#itemsDisplaySection = document.getElementById(itemsDisplaySectionId);
        this.#itemsAnalyticsSection = document.getElementById(itemsAnalyticsSectionId);
    }

    displayItems(items) {
        this.#itemsDisplaySection.innerHTML = "";

        items.forEach(item => {
            const updatedImageUrl = item.getImageUrl().replace(/l140|l500/, "l1000");
            const itemHTML = `
                <div class="item-card">
                    <div class="item-image">
                        <img src="${updatedImageUrl}" alt="${item.getName()}" />
                    </div>
                    <div class="item-details">
                        <a class="item-title" href="${item.getLink()}" target="_blank">
                            <h3>${item.getName()}</h3>
                        </a>
                        <p class="item-price"><strong>Price:</strong> ${item.getPrice()}</p>
                        <p class="item-condition"><strong>Condition:</strong> ${item.getCondition()}</p>
                        <p class="item-postage"><strong>Postage:</strong> ${item.getPostage()}</p>
                        <p class="item-seller"><strong>Seller:</strong> ${item.getSeller()}</p>
                        ${item.getSoldDate() ? `<p class="item-sold-date"><strong>Sold Date:</strong> ${item.getSoldDate()}</p>` : ""}
                    </div>
                </div>
            `;
            this.#itemsDisplaySection.innerHTML += itemHTML;
        });
    }

    displayItemAnalytics(items) {
        this.#itemsAnalyticsSection.innerHTML = "";

        const totalItems = items.length;
        const prices = items.map(item => item.getTotalPrice());

        const averagePrice = (prices.reduce((sum, price) => sum + price, 0) / totalItems).toFixed(2);
        const minPrice = Math.min(...prices).toFixed(2);
        const maxPrice = Math.max(...prices).toFixed(2);
        const medianPrice = (prices.sort((a, b) => a - b)[Math.floor(totalItems / 2)]).toFixed(2);

        const conditionStats = items.reduce((acc, item) => {
            const totalPrice = item.getTotalPrice();
            if (!acc[item.getCondition()]) {
                acc[item.getCondition()] = { count: 0, total: 0 };
            }
            acc[item.getCondition()].count += 1;
            acc[item.getCondition()].total += totalPrice;
            return acc;
        }, {});

        const uniqueSellers = [...new Set(items.map(item => item.getSeller()))].length;
        const freePostageCount = items.filter(item => item.getPostage().toLowerCase().includes("free")).length;
        const freePostagePercentage = ((freePostageCount / totalItems) * 100).toFixed(2);

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
        }).join("")}
                    </ul>
                </div>
                <div"><canvas id="sold-items-chart"></canvas></div>
            </div>
        `;
        this.#itemsAnalyticsSection.innerHTML = statsHTML;

        const soldItems = items.filter(item => item.getSoldDate());
        const labels = soldItems.map(item => item.getSoldDate().replace("Sold ", ""));
        const data = soldItems.map(item => parseFloat(item.getPrice().replace(/[^0-9.-]+/g, "")));

        ChartManager.renderSoldItemsPriceChart(labels, data, "sold-items-chart")
    }
}