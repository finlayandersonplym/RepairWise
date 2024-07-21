
function activePage() {
    $(".nav-link").on("click", function (event) {
        event.preventDefault();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
        let page = $(this).data("page");
        $("#page-content").load(page + ".html");
    });
}

$(document).ready(function () {
    $("#page-content").load("dashboard.html");
    activePage();
});