import { DashboardManager } from "./dashboard-manager.js";
export function initializeDashboard() {
    const dashboardManager = new DashboardManager();
    dashboardManager.displayPriceAnalysis("item-price-analytics");
    dashboardManager.displayItemsSoldByDayChart("item-category-graph");
    dashboardManager.displayItemWatchChanges("item-watch-section");
}
