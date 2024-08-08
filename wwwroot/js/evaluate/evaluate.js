import { ItemEvaluator } from "./item-evaluator.js";

export function initializeEvaluatePage() {
    const itemEvaluator = new ItemEvaluator("item-search-form");
    itemEvaluator.initialize();
}
