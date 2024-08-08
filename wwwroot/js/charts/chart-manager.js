export class ChartManager {

    static renderInventoryCategoryChart(categories, elementId) {
        const ctx = document.getElementById(elementId).getContext("2d");
        const labels = Object.keys(categories);
        const data = Object.values(categories).map(items => items.length);

        new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Items in Inventory",
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
                            text: "Number of Items"
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

    static renderCumulativeRevenueChart(items, elementId) {
        const ctx = document.getElementById(elementId).getContext("2d");

        const itemsWithSoldDate = this.#getItemsWithSoldDate(items);
        const sortedItems = itemsWithSoldDate.sort((a, b) => new Date(a.sold_date) - new Date(b.sold_date));
        const labels = sortedItems.map(item => item.sold_date);
        const cumulativeRevenue = [];
        let totalRevenue = 0;

        sortedItems.forEach(item => {
            totalRevenue += parseFloat(item.selling_price || 0);
            cumulativeRevenue.push(totalRevenue);
        });

        new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Cumulative Revenue",
                    data: cumulativeRevenue,
                    backgroundColor: "rgba(153, 102, 255, 0.2)",
                    borderColor: "rgba(153, 102, 255, 1)",
                    borderWidth: 1,
                    fill: true
                }]
            },
            options: {
                scales: {
                    x: {
                        type: "time",
                        title: {
                            display: true,
                            text: "Date"
                        },
                        time: {
                            unit: "day"
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Cumulative Revenue"
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    static renderRevenueByDayChart(items, elementId) {
        const ctx = document.getElementById(elementId).getContext("2d");

        const itemsWithSoldDate = this.#getItemsWithSoldDate(items);
        const revenueByDay = this.#groupRevenueByDay(itemsWithSoldDate);

        const labels = Object.keys(revenueByDay).sort((a, b) => new Date(a) - new Date(b));
        const data = labels.map(date => revenueByDay[date]);

        new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Revenue by Day",
                    data: data,
                    backgroundColor: "rgba(255, 159, 64, 0.2)",
                    borderColor: "rgba(255, 159, 64, 1)",
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        type: "time",
                        time: {
                            unit: "day"
                        },
                        title: {
                            display: true,
                            text: "Date"
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Revenue"
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    static renderSoldItemsPriceChart(labels, data, elementId) {
        new Chart(
            document.getElementById(elementId), {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Sold Items Price",
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
                            text: "Date Sold"
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Price"
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    static renderCategoryChart(categories, elementId) {
        const ctx = document.getElementById(elementId).getContext("2d");
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

    static renderItemsSoldByDayChart(labels, data, elementId) {
        const ctx = document.getElementById(elementId).getContext("2d");

        new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Items Sold by Day",
                    data: data,
                    backgroundColor: "rgba(153, 102, 255, 0.2)",
                    borderColor: "rgba(153, 102, 255, 1)",
                    borderWidth: 1,
                    fill: true
                }]
            },
            options: {
                scales: {
                    x: {
                        type: "time",
                        time: {
                            unit: "day"
                        },
                        title: {
                            display: true,
                            text: "Date"
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


    static #getItemsWithSoldDate(items) {
        return items.map(item => {
            const soldHistory = item.history.find(entry => entry.updateProperty === "state" && entry.newValue === "Sold");
            return {
                ...item,
                sold_date: soldHistory ? soldHistory.timestamp : null
            };
        }).filter(item => item.sold_date);
    }

    static #groupRevenueByDay(items) {
        return items.reduce((acc, item) => {
            const date = item.sold_date.split("T")[0];
            const revenue = parseFloat(item.selling_price || 0);

            if (!acc[date]) {
                acc[date] = 0;
            }
            acc[date] += revenue;
            return acc;
        }, {});
    }
}
