document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       GET LOADER
    ===================================================== */

    const loader = document.getElementById("loader");


    /* =====================================================
       GET ALL PURCHASE FORMS
    ===================================================== */

    const forms = document.querySelectorAll(
        ".data-page .buyForm"
    );


    /* =====================================================
       PROCESSING STATE

       Prevents multiple purchases at the same time.
    ===================================================== */

    let processing = false;


    /* =====================================================
       SAFETY CHECK
    ===================================================== */

    if (!loader || forms.length === 0) {

        console.log("Purchase loader: elements not found.");

        return;
    }


    /* =====================================================
       FORM SUBMISSION
    ===================================================== */

    forms.forEach(function (form) {

        form.addEventListener("submit", function (e) {


            /* =============================================
               PREVENT ANOTHER PURCHASE
            ============================================= */

            if (processing) {

                e.preventDefault();

                return;
            }


            /* =============================================
               GET CURRENT BUTTON
            ============================================= */

            const currentButton =
                form.querySelector(".buyBtn");


            /* =============================================
               SAFETY CHECK
            ============================================= */

            if (!currentButton) {

                return;
            }


            /* =============================================
               PREVENT DOUBLE CLICK
            ============================================= */

            if (currentButton.disabled) {

                e.preventDefault();

                return;
            }


            /* =============================================
               START PROCESSING
            ============================================= */

            processing = true;


            /* =============================================
               DISABLE ALL BUY BUTTONS
            ============================================= */

            const allButtons =
                document.querySelectorAll(
                    ".data-page .buyBtn"
                );

            allButtons.forEach(function (button) {

                button.disabled = true;

                button.innerText = "Processing...";

            });


            /* =============================================
               SHOW LOADER
            ============================================= */

            loader.classList.add("show");


            /*
             * IMPORTANT:
             * We DO NOT use preventDefault() here.
             *
             * The form is allowed to continue submitting
             * normally to your Express route.
             */

        });

    });

});


