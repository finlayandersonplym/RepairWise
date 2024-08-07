import { initializeInventoryPage } from "./inventory/inventory.js";
import { initializeEvaluatePage } from "./evaluate/evaluate.js"
import { initializeSalesPage } from "./sales/sales.js"
import { initializeDashboard } from "./dashboard/dashboard.js"
function activePage() {
    $(".nav-link").on("click", function (event) {
        event.preventDefault();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");

        let page = $(this).data("page");

        console.log("Loading: " + page + ".html");

        $("#page-content").load("pages/" + page + ".html", function () {
            if (page === 'inventory') {
                initializeInventoryPage();
            }
            if (page === 'evaluate') {
                initializeEvaluatePage()
            }
            if (page === 'sales') {
                initializeSalesPage()
            }
            if (page === 'dashboard') {
                initializeDashboard()
            }
        });
    });
}

$(document).ready(function () {
    activePage();
});
