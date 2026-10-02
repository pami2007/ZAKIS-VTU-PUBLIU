(function () {

    const savedTheme = localStorage.getItem("zaki-theme");

    if (savedTheme) {

        document.documentElement.setAttribute(
            "data-theme",
            savedTheme
        );

    } else {

        document.documentElement.setAttribute(
            "data-theme",
            "light"
        );
    }

})();


function toggleTheme() {

    const html = document.documentElement;

    const currentTheme =
        html.getAttribute("data-theme") || "light";

    const newTheme =
        currentTheme === "light"
            ? "dark"
            : "light";

    html.setAttribute(
        "data-theme",
        newTheme
    );

    localStorage.setItem(
        "zaki-theme",
        newTheme
    );

}