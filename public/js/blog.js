
        /* =====================================================
           THEME
        ===================================================== */

        const themeBtn =
            document.getElementById("themeBtn");


        const savedTheme =
            localStorage.getItem("zaki-theme");


        if (savedTheme) {

            document.body.setAttribute(
                "data-theme",
                savedTheme
            );

        }


        themeBtn.addEventListener(
            "click",
            function () {

                const currentTheme =
                    document.body.getAttribute(
                        "data-theme"
                    ) || "dark";


                const newTheme =
                    currentTheme === "dark"
                        ? "light"
                        : "dark";


                document.body.setAttribute(
                    "data-theme",
                    newTheme
                );


                localStorage.setItem(
                    "zaki-theme",
                    newTheme
                );

            }
        );



        /* =====================================================
           MOBILE MENU
        ===================================================== */

        const mobileMenuBtn =
            document.getElementById(
                "mobileMenuBtn"
            );


        const navLinks =
            document.getElementById(
                "navLinks"
            );


        mobileMenuBtn.addEventListener(
            "click",
            function () {

                navLinks.classList.toggle(
                    "open"
                );

            }
        );


        /* Close mobile menu after clicking link */

        document
            .querySelectorAll(".nav-links a")
            .forEach(function(link) {

                link.addEventListener(
                    "click",
                    function() {

                        navLinks.classList.remove(
                            "open"
                        );

                    }
                );

            });
