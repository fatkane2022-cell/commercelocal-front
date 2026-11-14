
function afficherMessage(zone, texte, type) {
  zone.textContent = texte;
  zone.className = "message " + type;
}

function emailValide(email) {
  return email.includes("@") && email.includes(".");
}

// bouton Afficher / Masquer du mot de passe
let boutonsVoir = document.querySelectorAll(".voir-mdp");
for (let i = 0; i < boutonsVoir.length; i++) {
  boutonsVoir[i].addEventListener("click", function () {
    let champ = this.previousElementSibling;
    if (champ.type === "password") {
      champ.type = "text";
      this.textContent = "Masquer";
    } else {
      champ.type = "password";
      this.textContent = "Afficher";
    }
  });
}

// connexion
let formConnexion = document.getElementById("form-connexion");
if (formConnexion) {
  formConnexion.addEventListener("submit", function (e) {
    e.preventDefault();
    let email = document.getElementById("co-email");
    let mdp = document.getElementById("co-mdp");
    let message = document.getElementById("message-connexion");

    email.classList.remove("champ-erreur");
    mdp.classList.remove("champ-erreur");

    if (!emailValide(email.value)) {
      email.classList.add("champ-erreur");
      afficherMessage(message, "Adresse e-mail invalide.", "erreur");
    } else if (mdp.value === "") {
      mdp.classList.add("champ-erreur");
      afficherMessage(message, "Veuillez entrer votre mot de passe.", "erreur");
    } else {
      afficherMessage(message, "Connexion réussie !", "succes");
      setTimeout(function () {
        window.location.href = "index.html";
      }, 1000);
    }
  });
}

// choix du rôle : un seul bouton actif à la fois
let roles = document.querySelectorAll(".role");
let roleChoisi = "Client";
for (let i = 0; i < roles.length; i++) {
  roles[i].addEventListener("click", function () {
    for (let j = 0; j < roles.length; j++) {
      roles[j].classList.remove("actif");
    }
    this.classList.add("actif");
    roleChoisi = this.textContent;
  });
}

// inscription
let formInscription = document.getElementById("form-inscription");
if (formInscription) {
  formInscription.addEventListener("submit", function (e) {
    e.preventDefault();
    let nom = document.getElementById("ins-nom");
    let prenom = document.getElementById("ins-prenom");
    let email = document.getElementById("ins-email");
    let mdp = document.getElementById("ins-mdp");
    let cgu = document.getElementById("ins-cgu");
    let message = document.getElementById("message-inscription");

    let champs = [nom, prenom, email, mdp];
    for (let i = 0; i < champs.length; i++) {
      champs[i].classList.remove("champ-erreur");
    }

    if (nom.value === "" || prenom.value === "") {
      if (nom.value === "") nom.classList.add("champ-erreur");
      if (prenom.value === "") prenom.classList.add("champ-erreur");
      afficherMessage(message, "Veuillez remplir le nom et le prénom.", "erreur");
    } else if (!emailValide(email.value)) {
      email.classList.add("champ-erreur");
      afficherMessage(message, "Adresse e-mail invalide.", "erreur");
    } else if (mdp.value.length < 8) {
      mdp.classList.add("champ-erreur");
      afficherMessage(message, "Le mot de passe doit faire au moins 8 caractères.", "erreur");
    } else if (!cgu.checked) {
      afficherMessage(message, "Vous devez accepter les conditions d'utilisation.", "erreur");
    } else {
      afficherMessage(message, "Compte créé, bienvenue " + prenom.value + " !", "succes");
      // le commerçant va sur son tableau de bord
      let page = "index.html";
      if (roleChoisi === "Commerçant") {
        page = "dashboard-commercant.html";
      }
      setTimeout(function () {
        window.location.href = page;
      }, 1500);
    }
  });
}