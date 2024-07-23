
function activePage() {
    $(".nav-link").on("click", function (event) {
        event.preventDefault();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
        let page = $(this).data("page");

        console.log("Loading: " + page)

        $("#page-content").load("pages/" + page + ".html");
    });
}

$(document).ready(function () {
    $("#page-content").load("pages/dashboard.html");
    activePage();
});