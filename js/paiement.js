// script des pages créneau et paiement
// le panier est simulé et les choix sont gardés dans le localStorage du navigateur

// produits du panier (fausses données)
let panier = [
  { nom: "Baguette tradition", quantite: 2, prix: 1.30 },
  { nom: "Croissant", quantite: 1, prix: 1.10 },
  { nom: "Comté 200 g", quantite: 1, prix: 4.00 },
  { nom: "Pommes 1 kg", quantite: 1, prix: 2.00 }
];

// on reprend les choix déjà faits (ou des valeurs par défaut)
let commande = JSON.parse(localStorage.getItem("commande")) || {
  mode: "Retrait en magasin",
  frais: 0,
  jour: "",
  creneau: "10h00 - 12h00",
  paiement: "Carte bancaire"
};

function sauvegarder() {
  localStorage.setItem("commande", JSON.stringify(commande));
}

// écrit un prix au format français : 9.7 devient "9,70 €"
function formatPrix(nombre) {
  return nombre.toFixed(2).replace(".", ",") + " €";
}

// petit effet orange quand le total change
function animerPrix(element) {
  element.classList.remove("change");
  void element.offsetWidth;
  element.classList.add("change");
}

// rend un seul bouton actif dans un groupe
function choisirUnSeul(boutons, boutonClique) {
  for (let i = 0; i < boutons.length; i++) {
    boutons[i].classList.remove("actif");
  }
  boutonClique.classList.add("actif");
}

// remet en "actif" le bouton qui correspond au choix sauvegardé
function reselectionner(boutons, texte) {
  for (let i = 0; i < boutons.length; i++) {
    let titre = boutons[i].querySelector("strong") || boutons[i];
    if (titre.textContent === texte && !boutons[i].disabled) {
      choisirUnSeul(boutons, boutons[i]);
    }
  }
}

// récapitulatif (le même sur les deux pages)
function mettreAJourRecap() {
  let liste = document.getElementById("liste-produits");
  liste.innerHTML = "";
  let totalProduits = 0;
  let nbArticles = 0;

  for (let i = 0; i < panier.length; i++) {
    let p = panier[i];
    let ligne = document.createElement("li");
    ligne.innerHTML = "<span>" + p.quantite + " × " + p.nom + "</span><span>" + formatPrix(p.quantite * p.prix) + "</span>";
    liste.appendChild(ligne);
    totalProduits += p.quantite * p.prix;
    nbArticles += p.quantite;
  }

  let total = totalProduits + commande.frais;
  document.getElementById("texte-articles").textContent = "Produits (" + nbArticles + " articles)";
  document.getElementById("prix-produits").textContent = formatPrix(totalProduits);
  document.getElementById("prix-livraison").textContent = formatPrix(commande.frais);
  document.getElementById("prix-total").textContent = formatPrix(total);
  animerPrix(document.getElementById("prix-total"));

  let boutonPayer = document.getElementById("bouton-payer");
  if (boutonPayer) {
    boutonPayer.textContent = "Payer " + formatPrix(total);
  }

  document.getElementById("resume-creneau").textContent =
    commande.mode + " · " + commande.jour + " · " + commande.creneau;
}

// ----- page créneau -----
let choixJour = document.getElementById("choix-jour");
if (choixJour) {
  // la liste des 7 prochains jours
  let jours = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  let mois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  for (let i = 0; i < 7; i++) {
    let date = new Date();
    date.setDate(date.getDate() + i);
    let texte = jours[date.getDay()] + " " + date.getDate() + " " + mois[date.getMonth()];
    if (i === 0) texte = "Aujourd'hui - " + texte;
    if (i === 1) texte = "Demain - " + texte;
    let option = document.createElement("option");
    option.value = texte;
    option.textContent = "📅 " + texte;
    choixJour.appendChild(option);
  }
  if (commande.jour) choixJour.value = commande.jour;
  commande.jour = choixJour.value;

  choixJour.addEventListener("change", function () {
    commande.jour = choixJour.value;
    mettreAJourRecap();
  });

  // retrait (gratuit) ou livraison (2 €)
  let modes = document.querySelectorAll(".mode");
  reselectionner(modes, commande.mode);
  for (let i = 0; i < modes.length; i++) {
    modes[i].addEventListener("click", function () {
      choisirUnSeul(modes, this);
      commande.mode = this.querySelector("strong").textContent;
      commande.frais = Number(this.dataset.frais);
      mettreAJourRecap();
    });
  }

  // les horaires (les créneaux complets sont désactivés dans le HTML)
  let creneaux = document.querySelectorAll(".creneau");
  reselectionner(creneaux, commande.creneau);
  for (let i = 0; i < creneaux.length; i++) {
    creneaux[i].addEventListener("click", function () {
      choisirUnSeul(creneaux, this);
      commande.creneau = this.textContent;
      mettreAJourRecap();
    });
  }

  // on garde les choix et on passe à la page paiement
  document.getElementById("bouton-continuer").addEventListener("click", function () {
    sauvegarder();
    window.location.href = "paiement.html";
  });
}

// ----- page paiement -----
let boutonPayer = document.getElementById("bouton-payer");
if (boutonPayer) {
  let paiements = document.querySelectorAll(".paiement");
  let formCarte = document.getElementById("form-carte");
  let infoAutre = document.getElementById("info-autre");

  // affiche le formulaire de carte ou un petit message selon le choix
  function afficherChoix(bouton) {
    let type = bouton.dataset.type;
    if (type === "carte") {
      formCarte.classList.remove("cache");
      infoAutre.textContent = "";
    } else {
      formCarte.classList.add("cache");
      infoAutre.textContent = "Vous serez redirigé vers " + bouton.querySelector("strong").textContent + " pour valider le paiement.";
    }
  }

  reselectionner(paiements, commande.paiement);
  afficherChoix(document.querySelector(".paiement.actif"));

  for (let i = 0; i < paiements.length; i++) {
    paiements[i].addEventListener("click", function () {
      choisirUnSeul(paiements, this);
      commande.paiement = this.querySelector("strong").textContent;
      afficherChoix(this);
      sauvegarder();
    });
  }

  // ajoute un espace tous les 4 chiffres dans le numéro de carte
  let numero = document.getElementById("carte-numero");
  numero.addEventListener("input", function () {
    let chiffres = numero.value.replace(/\D/g, "").slice(0, 16);
    numero.value = chiffres.replace(/(\d{4})(?=\d)/g, "$1 ");
  });

  // ajoute le "/" dans la date
  let date = document.getElementById("carte-date");
  date.addEventListener("input", function () {
    let chiffres = date.value.replace(/\D/g, "").slice(0, 4);
    date.value = chiffres.length > 2 ? chiffres.slice(0, 2) + "/" + chiffres.slice(2) : chiffres;
  });

  boutonPayer.addEventListener("click", function () {
    let message = document.getElementById("message-paiement");

    // on vérifie la carte seulement si "Carte bancaire" est choisi
    if (commande.paiement === "Carte bancaire") {
      let champs = ["carte-nom", "carte-numero", "carte-date", "carte-cvc"];
      let tailles = [1, 19, 5, 3];
      for (let i = 0; i < champs.length; i++) {
        let champ = document.getElementById(champs[i]);
        champ.classList.remove("champ-erreur");
        if (champ.value.trim().length < tailles[i]) {
          champ.classList.add("champ-erreur");
          message.textContent = "Veuillez vérifier les informations de la carte.";
          message.className = "message erreur";
          return;
        }
      }
    }

    boutonPayer.textContent = "Paiement en cours...";
    boutonPayer.disabled = true;
    setTimeout(function () {
      message.textContent = "Paiement accepté ! Votre commande est confirmée.";
      message.className = "message succes";
      boutonPayer.textContent = "Commande confirmée ✓";
      localStorage.removeItem("commande");
    }, 1500);
  });
}

// au chargement de la page
mettreAJourRecap();