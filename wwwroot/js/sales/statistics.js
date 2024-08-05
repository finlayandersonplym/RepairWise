
import { LocalStorageManager } from "../localstorage-utils.js";
import { ComponentFactory } from "../components/component-factory.js";

const localStorageManager = new LocalStorageManager();

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
        <p><strong>Total Sold Items:</strong> ${stats.totalItems}</p>
        <p><strong>Total Revenue:</strong> &pound${stats.totalRevenue}</p>
        <p><strong>Average Price:</strong> &pound${stats.avgPrice}</p>
        <p><strong>Minimum Price:</strong> &pound${stats.minPrice}</p>
        <p><strong>Maximum Price:</strong> &pound${stats.maxPrice}</p>
        <p><strong>Median Price:</strong> &pound${stats.medianPrice}</p>
        <p><strong>Most Popular Category:</strong> ${stats.mostPopularCategory}</p>
        <p><strong>Number of Unique Categories:</strong> ${stats.uniqueCategories}</p>
        <p><strong>Free Postage Percentage:</strong> ${stats.freePostagePercentage}%</p>
        <h4>Condition Distribution:</h4>
        <ul>
            ${Object.keys(stats.conditionStats).map(condition =>
        `<li>${condition}: ${stats.conditionStats[condition]}</li>`).join("")}
        </ul>
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

function renderCategoryChart(categories) {
    const ctx = document.getElementById("sales-category-chart").getContext("2d");
    const labels = Object.keys(categories);
    const data = Object.values(categories).map(items => items.length);

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Items Sold",
                data: data,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Category"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Number of Items Sold"
                    },
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

export function initializeSalesAnalytics() {
    const items = loadSalesData();
    const stats = calculateStatistics(items);
    displayStatistics(stats);

    const categories = groupByCategory(items);
    renderCategoryChart(categories);
}