import { LocalStorageManager } from "../localstorage-utils.js";
import { ChartManager } from "../charts/chart-manager.js";
import { ItemWatcher } from "./item-watch-form.js";

export class DashboardManager {
    #localStorageManager;
    
    constructor() {
        this.#localStorageManager = new LocalStorageManager();
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
