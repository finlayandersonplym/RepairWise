import { DashboardManager } from "./dashboard-manager.js";
import { ItemWatcher } from "./item-watch-form.js";
export function initializeDashboard() {
    const dashboardManager = new DashboardManager();
    dashboardManager.displayPriceAnalysis("item-price-analytics");
    dashboardManager.displayCategoryChart("item-category-graph");
    const itemWatcher = new ItemWatcher();
    itemWatcher.hasItemChanged();
}
