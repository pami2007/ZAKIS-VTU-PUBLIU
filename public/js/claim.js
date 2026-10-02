document.addEventListener("DOMContentLoaded", function () {

        const form =
            document.getElementById("cashbackClaimForm");

        const button =
            document.getElementById("claimCashbackBtn");

        const normalContent =
            document.getElementById("claimNormalContent");

        const loadingContent =
            document.getElementById("claimLoadingContent");


        if (!form || !button) {

            return;

        }


        form.addEventListener("submit", function (event) {

            /*
             * IMPORTANT:
             *
             * If the user clicks twice very quickly,
             * the second submit event can reach here.
             *
             * This flag makes sure we process only
             * the FIRST submission.
             */

            if (button.dataset.submitting === "true") {

                event.preventDefault();

                return;

            }


            /* Mark as submitting */

            button.dataset.submitting = "true";


            /* Disable the button */

            button.disabled = true;


            /* Prevent pointer interaction */

            button.classList.add("claiming");


            /* Hide normal button */

            normalContent.style.display = "none";


            /* Show loader */

            loadingContent.style.display = "inline-flex";


            /*
             * DO NOT use setTimeout here.
             *
             * The browser will naturally navigate to the
             * server response after submitting the form.
             *
             * The button remains disabled while that happens.
             */

        });

    });