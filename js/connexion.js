// JS des pages connexion et inscription (données simulées, pas de vrai serveur)

// petite fonction pour afficher un message sous le formulaire
function afficherMessage(zone, texte, type) {
  zone.textContent = texte;
  zone.className = "message " + type;
}

// vérifie qu'une adresse e-mail a la bonne forme
function emailValide(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// formulaire de connexion
const formConnexion = document.getElementById("form-connexion");
if (formConnexion) {
  formConnexion.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("co-email");
    const mdp = document.getElementById("co-mdp");
    const message = document.getElementById("message-connexion");

    email.classList.remove("champ-erreur");
    mdp.classList.remove("champ-erreur");

    if (!emailValide(email.value)) {
      email.classList.add("champ-erreur");
      afficherMessage(message, "Veuillez entrer une adresse e-mail valide.", "erreur");
      return;
    }
    if (mdp.value.length === 0) {
      mdp.classList.add("champ-erreur");
      afficherMessage(message, "Veuillez entrer votre mot de passe.", "erreur");
      return;
    }

    // on garde le nom de l'utilisateur pour les autres pages
    localStorage.setItem("utilisateur", email.value);
    afficherMessage(message, "Connexion réussie, redirection...", "succes");
    setTimeout(function () { window.location.href = "index.html"; }, 1200);
  });
}

// boutons client / commerçant / livreur : un seul sélectionné à la fois
const boutonsRole = document.querySelectorAll(".role");
let roleChoisi = "Client";
boutonsRole.forEach(function (bouton) {
  bouton.addEventListener("click", function () {
    boutonsRole.forEach(function (b) { b.classList.remove("actif"); });
    bouton.classList.add("actif");
    roleChoisi = bouton.textContent;
  });
});

// formulaire d'inscription
const formInscription = document.getElementById("form-inscription");
if (formInscription) {
  formInscription.addEventListener("submit", function (e) {
    e.preventDefault();
    const nom = document.getElementById("ins-nom");
    const prenom = document.getElementById("ins-prenom");
    const email = document.getElementById("ins-email");
    const mdp = document.getElementById("ins-mdp");
    const cgu = document.getElementById("ins-cgu");
    const message = document.getElementById("message-inscription");

    [nom, prenom, email, mdp].forEach(function (c) { c.classList.remove("champ-erreur"); });

    if (nom.value.trim() === "" || prenom.value.trim() === "") {
      if (nom.value.trim() === "") nom.classList.add("champ-erreur");
      if (prenom.value.trim() === "") prenom.classList.add("champ-erreur");
      afficherMessage(message, "Veuillez entrer votre nom et votre prénom.", "erreur");
      return;
    }
    if (!emailValide(email.value)) {
      email.classList.add("champ-erreur");
      afficherMessage(message, "Veuillez entrer une adresse e-mail valide.", "erreur");
      return;
    }
    if (mdp.value.length < 8) {
      mdp.classList.add("champ-erreur");
      afficherMessage(message, "Le mot de passe doit faire au moins 8 caractères.", "erreur");
      return;
    }
    if (!cgu.checked) {
      afficherMessage(message, "Vous devez accepter les conditions d'utilisation.", "erreur");
      return;
    }

    // le commerçant va sur son tableau de bord, les autres sur l'accueil
    localStorage.setItem("utilisateur", prenom.value);
    afficherMessage(message, "Bienvenue " + prenom.value + " ! Compte " + roleChoisi.toLowerCase() + " créé.", "succes");
    const pageSuivante = roleChoisi === "Commerçant" ? "dashboard-commercant.html" : "index.html";
    setTimeout(function () { window.location.href = pageSuivante; }, 1500);
  });
}
