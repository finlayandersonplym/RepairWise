import { initializeInventoryPage } from "./inventory/inventory.js";
import { initializeEvaluatePage } from "./evaluate/evaluate.js";
import { initializeSalesPage } from "./sales/sales.js";
import { initializeDashboard } from "./dashboard/dashboard.js";
import { intitalizeSearchBar } from "./searchbar.js"
export class PageManager {
    constructor() {
        this.init();
    }

    init() {
        intitalizeSearchBar();
        this.attachNavLinkHandler();
    }

    attachNavLinkHandler() {
        $(".nav-link").on("click", (event) => {
            event.preventDefault();
            this.handleNavLinkClick(event);
        });
    }

    handleNavLinkClick(event) {
        $(".nav-link").removeClass("active");
        $(event.currentTarget).addClass("active");

        const page = $(event.currentTarget).data("page");
        console.log("Loading: " + page + ".html");

        $("#page-content").load("pages/" + page + ".html", () => {
            this.initializePage(page);
        });
    }

    initializePage(page) {
        switch (page) {
            case 'inventory':
                initializeInventoryPage();
                break;
            case 'evaluate':
                initializeEvaluatePage();
                break;
            case 'sales':
                initializeSalesPage();
                break;
            case 'dashboard':
                initializeDashboard();
                break;
            default:
                console.warn("Unknown page: " + page);
        }
    }
}

