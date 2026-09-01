/* =====================================================
   HANDLING SERVICES SARL
   DEVIS SMART CONTEXT
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("devisForm");

    if (!form) {
        return;
    }


    const serviceSelect = document.getElementById("service");
    const zoneSelect = document.getElementById("zone");
    const contextBox = document.getElementById("devisContext");
    const successBox = document.getElementById("devisSuccess");


    /* =====================================================
       LABELS
    ===================================================== */

    const serviceLabels = {

        manutention: "Manutention",

        dechargement: "Déchargement",

        location: "Location de matériel"

    };


    const zoneLabels = {

        agadir: "Agadir",

        dakhla: "Dakhla",

        autre: "Autre"

    };


    /* =====================================================
       READ URL
       
       Examples:
       devis.html?service=manutention
       devis.html?zone=agadir
       devis.html?service=manutention&zone=agadir
    ===================================================== */

    const params = new URLSearchParams(window.location.search);

    const serviceFromURL = params.get("service");
    const zoneFromURL = params.get("zone");


    /* =====================================================
       SET SERVICE
    ===================================================== */

    function setService(value) {

        if (!value) {
            return;
        }

        const exists = Array.from(serviceSelect.options)
            .some(option => option.value === value);

        if (exists) {
            serviceSelect.value = value;
        }

    }


    /* =====================================================
       SET ZONE
    ===================================================== */

    function setZone(value) {

        if (!value) {
            return;
        }

        const exists = Array.from(zoneSelect.options)
            .some(option => option.value === value);

        if (exists) {
            zoneSelect.value = value;
        }

    }


    /* =====================================================
       UPDATE CONTEXT MESSAGE
    ===================================================== */

    function updateContext() {

        const service = serviceSelect.value;
        const zone = zoneSelect.value;


        if (!service && !zone) {

            contextBox.classList.remove("active");
            contextBox.innerHTML = "";

            return;
        }


        let message = "Votre demande";


        if (service && zone) {

            message =
                "Vous demandez un devis pour <strong>"
                + serviceLabels[service]
                + "</strong> à <strong>"
                + zoneLabels[zone]
                + "</strong>.";

        }

        else if (service) {

            message =
                "Votre demande concerne le service : <strong>"
                + serviceLabels[service]
                + "</strong>.";

        }

        else if (zone) {

            message =
                "Votre demande concerne une opération à <strong>"
                + zoneLabels[zone]
                + "</strong>.";

        }


        contextBox.innerHTML = message;

        contextBox.classList.add("active");

    }


    /* =====================================================
       INITIALIZE FROM URL
    ===================================================== */

    setService(serviceFromURL);

    setZone(zoneFromURL);

    updateContext();


    /* =====================================================
       LISTEN TO CHANGES
    ===================================================== */

    serviceSelect.addEventListener("change", function () {

        updateContext();

    });


    zoneSelect.addEventListener("change", function () {

        updateContext();

    });


    /* =====================================================
       FORM SUBMIT
       
       IMPORTANT:
       This currently prepares the request.
       It does NOT send email by itself.
    ===================================================== */

    form.addEventListener("submit", function (event) {

        event.preventDefault();


        const service = serviceSelect.value;
        const zone = zoneSelect.value;

        const name = document.getElementById("name").value.trim();
        const company = document.getElementById("company").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim();
        const date = document.getElementById("date").value;
        const quantity = document.getElementById("quantity").value.trim();
        const message = document.getElementById("message").value.trim();


        if (!service || !zone || !name || !phone || !message) {

            alert(
                "Merci de remplir tous les champs obligatoires."
            );

            return;
        }


        /* =================================================
           BUILD REQUEST
        ================================================= */

        const request = {

            service: serviceLabels[service],

            zone: zoneLabels[zone],

            name: name,

            company: company,

            phone: phone,

            email: email,

            date: date,

            quantity: quantity,

            message: message

        };


        /*
         * Save locally.
         * This allows us to keep the request temporarily
         * in the browser until a real sending system
         * is connected.
         */

        localStorage.setItem(
            "handlingServicesDevis",
            JSON.stringify(request)
        );


        /* =================================================
           SUCCESS MESSAGE
        ================================================= */

        successBox.innerHTML =

            "Votre demande concernant <strong>"
            + request.service
            + "</strong> à <strong>"
            + request.zone
            + "</strong> a été préparée avec succès. "
            + "Notre équipe pourra traiter votre demande.";

        successBox.classList.add("active");


        /* =================================================
           SCROLL TO SUCCESS
        ================================================= */

        successBox.scrollIntoView({

            behavior: "smooth",

            block: "center"

        });


        /*
         * Ici nous pourrons connecter ensuite:
         *
         * - Email
         * - WhatsApp
         * - Formspree
         * - PHP / Hostinger
         * - Backend
         *
         * sans modifier le design.
         */

    });


});