import { LocalStorageManager } from "../localstorage-utils.js";
import { ChartManager } from "../charts/chart-manager.js";

const localStorageManager = new LocalStorageManager();

export function initializeSalesAnalytics() {
    const items = loadSalesData();
    const stats = calculateStatistics(items);
    displayStatistics(stats);

    const categories = groupByCategory(items);
    ChartManager.renderCategoryChart(categories, "sales-category-chart");
    ChartManager.renderCumulativeRevenueChart(items, "cumlative-revenue-chart");
    ChartManager.renderRevenueByDayChart(items, "revenue-chart");
}

function loadSalesData() {
    return localStorageManager.getJsonItems("itemList").filter(item => item.state === "Sold");
}

function calculateStatistics(items) {
    const totalItems = items.length;

    if (totalItems === 0) {
        return {
            totalItems: 0,
            totalRevenue: "0.00",
            avgPrice: "0.00",
            minPrice: "0.00",
            maxPrice: "0.00",
            medianPrice: "0.00",
            mostPopularCategory: "N/A",
            uniqueCategories: 0,
            freePostagePercentage: "0.00",
            conditionStats: {}
        };
    }

    const totalRevenue = items.reduce((sum, item) => sum + parseFloat(item.selling_price || 0), 0).toFixed(2);
    const avgPrice = (totalRevenue / totalItems).toFixed(2);

    const prices = items.map(item => parseFloat(item.selling_price || 0));
    const minPrice = Math.min(...prices).toFixed(2);
    const maxPrice = Math.max(...prices).toFixed(2);
    const medianPrice = (prices.sort((a, b) => a - b)[Math.floor(totalItems / 2)]).toFixed(2);

    const categories = groupByCategory(items);
    const mostPopularCategory = Object.keys(categories).reduce((a, b) => categories[a].length > categories[b].length ? a : b);
    const uniqueCategories = Object.keys(categories).length;

    const freePostageCount = items.filter(item => item.postage && item.postage.toLowerCase().includes("free")).length;
    const freePostagePercentage = ((freePostageCount / totalItems) * 100).toFixed(2);

    const conditionStats = items.reduce((acc, item) => {
        const condition = item.condition || "Unknown";
        if (!acc[condition]) {
            acc[condition] = 0;
        }
        acc[condition]++;
        return acc;
    }, {});

    return {
        totalItems,
        totalRevenue,
        avgPrice,
        minPrice,
        maxPrice,
        medianPrice,
        mostPopularCategory,
        uniqueCategories,
        freePostagePercentage,
        conditionStats
    };
}

function displayStatistics(stats) {
    const statsContent = document.getElementById("sales-stats-section");
    statsContent.innerHTML = `
        <div class="stats-container">
            <div class="stat-item">
                <strong>Total Sold Items:</strong> ${stats.totalItems}
            </div>
            <div class="stat-item">
                <strong>Total Revenue:</strong> &pound${stats.totalRevenue}
            </div>
            <div class="stat-item">
                <strong>Average Price:</strong> &pound${stats.avgPrice}
            </div>
            <div class="stat-item">
                <strong>Minimum Price:</strong> &pound${stats.minPrice}
            </div>
            <div class="stat-item">
                <strong>Maximum Price:</strong> &pound${stats.maxPrice}
            </div>
            <div class="stat-item">
                <strong>Median Price:</strong> &pound${stats.medianPrice}
            </div>
            <div class="stat-item">
                <strong>Most Popular Category:</strong> ${stats.mostPopularCategory}
            </div>
            <div class="stat-item">
                <strong>Number of Unique Categories:</strong> ${stats.uniqueCategories}
            <div class="condition-distribution">
                <strong>Condition Distribution:</strong>
                <ul>
                    ${Object.keys(stats.conditionStats).map(condition =>
        `<li>${condition}: ${stats.conditionStats[condition]}</li>`).join("")}
                </ul>
            </div>
        </div>
    `;
}


function groupByCategory(items) {
    return items.reduce((acc, item) => {
        const category = item.category || "Uncategorized";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {});
}

