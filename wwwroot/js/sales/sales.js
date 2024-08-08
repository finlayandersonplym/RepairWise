import { SalesAnalytics } from "./statistics.js";


export function initializeSalesPage() {
    const salesAnalytics = new SalesAnalytics();
    salesAnalytics.initializeSalesAnalytics();
}
