document.querySelectorAll(".commande").forEach(function (commande) {
    const etat = commande.querySelector(".etat");
    const boutonAccepter = commande.querySelector(".plein");
    const boutonRefuser = commande.querySelector(".contour");

    boutonAccepter.addEventListener("click", function () {
        etat.textContent = "Acceptée";
        etat.className = "etat accepte";
        boutonAccepter.disabled = true;
        boutonRefuser.disabled = true;
    });

    boutonRefuser.addEventListener("click", function () {
        etat.textContent = "Refusée";
        etat.className = "etat refuse";
        boutonAccepter.disabled = true;
        boutonRefuser.disabled = true;
    });
});