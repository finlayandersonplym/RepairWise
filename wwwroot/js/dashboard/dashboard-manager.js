import { LocalStorageManager } from "../localstorage-utils.js";
import { ChartManager } from "../charts/chart-manager.js";
import { ItemWatcher } from "./item-watcher.js";

export class DashboardManager {
    #localStorageManager;
    #itemWatcher;

    constructor() {
        this.#localStorageManager = new LocalStorageManager();
        this.#itemWatcher = new ItemWatcher();
    }

    displayTotalItems(elementId) {
        const items = this.#localStorageManager.getJsonItems("itemList");

        const totalItemsElement = document.getElementById(elementId);
        totalItemsElement.innerHTML = `<p>Total Items: ${items.length}</p>`;
    }

    displayPriceAnalysis(elementId) {
        const items = this.#localStorageManager.getJsonItems("itemList");

        const totalPrices = items.map(item => item.selling_price);
        const totalCostPrices = items.map(item => item.cost_price);

        const averagePrice = (totalPrices.reduce((sum, price) => sum + price, 0) / items.length).toFixed(2);
        const averageCostPrice = (totalCostPrices.reduce((sum, price) => sum + price, 0) / items.length).toFixed(2);
        const priceDifference = (averagePrice - averageCostPrice).toFixed(2);

        // Calculate median price
        const medianPrice = this.#calculateMedian(totalPrices).toFixed(2);
        const medianCostPrice = this.#calculateMedian(totalCostPrices).toFixed(2);

        // Calculate price range
        const minPrice = Math.min(...totalPrices).toFixed(2);
        const maxPrice = Math.max(...totalPrices).toFixed(2);

        const priceAnalysisHTML = `
            <h3>Price Analytics</h3>
            <div class="stats-container">
                <div class="stat-item">
                    <p>Average Selling Price: &pound;${averagePrice}</p>
                </div>
                <div class="stat-item">
                    <p>Average Cost Price: &pound;${averageCostPrice}</p>
                </div>
                <div class="stat-item">
                    <p>Average Profit per Item: &pound;${priceDifference}</p>
                </div>
                <div class="stat-item">
                    <p>Median Selling Price: &pound;${medianPrice}</p>
                </div>
                <div class="stat-item">
                    <p>Median Cost Price: &pound;${medianCostPrice}</p>
                </div>
                <div class="stat-item">
                    <p>Price Range: &pound;${minPrice} - &pound;${maxPrice}</p>
                </div>
            </div>
        `;

        const priceAnalysisElement = document.getElementById(elementId);
        priceAnalysisElement.innerHTML = priceAnalysisHTML;
    }

    displayCategoryChart(elementId) {
        const items = this.#localStorageManager.getJsonItems("itemList");

        const unsoldItems = items.filter(item => item.state !== "Sold");

        const categories = this.#groupByCategory(unsoldItems);
        ChartManager.renderInventoryCategoryChart(categories, elementId);
    }

    async displayItemWatchChanges(elementId) {
        const changes = await this.#itemWatcher.hasItemChanged();

        let changesHTML = '<h3>Item Watch Changes</h3>';

        changes.forEach(change => {
            changesHTML += `<div id="search-options">Search Options: ${JSON.stringify(change.searchOptions)}</div>`;
            changesHTML += '<ul>';
            change.changes.added.forEach(item => {
                changesHTML += `<li class="added"><span>Added:</span> <a href="${item.link}">${item.name}</a> - ${item.price}</li>`;
            });
            change.changes.removed.forEach(item => {
                changesHTML += `<li class="removed"><span>Removed:</span> <a href="${item.link}">${item.name}</a> - ${item.price}</li>`;
            });
            change.changes.changed.forEach(item => {
                changesHTML += `<li class="changed"><a href="${item.link}">Item Changed:</a><ul>`;
                Object.keys(item.changes).forEach(key => {
                    changesHTML += `<li>${key}: ${item.changes[key].old} -> ${item.changes[key].new}</li>`;
                });
                changesHTML += `</ul></li>`;
            });
            changesHTML += '</ul>';
        });

        const itemWatchElement = document.getElementById(elementId);
        itemWatchElement.innerHTML = changesHTML;
    }

    async displayItemsSoldByDayChart(elementId) {
        const items = this.#localStorageManager.getJsonItems("itemList");
        const soldItems = items.filter(item => item.state === "Sold");

        const soldDates = soldItems.map(item => new Date(item.sold_date).toLocaleDateString());

        const dateCount = soldDates.reduce((acc, date) => {
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        const labels = Object.keys(dateCount).sort((a, b) => new Date(a) - new Date(b));
        const data = labels.map(date => dateCount[date]);

        ChartManager.renderItemsSoldByDayChart(labels, data, elementId);
    }

    #calculateMedian(prices) {
        prices.sort((a, b) => a - b);
        const mid = Math.floor(prices.length / 2);
        return prices.length % 2 !== 0 ? prices[mid] : (prices[mid - 1] + prices[mid]) / 2;
    }

    #groupByCategory(items) {
        return items.reduce((acc, item) => {
            const category = item.category || "Uncategorized";
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(item);
            return acc;
        }, {});
    }
}
