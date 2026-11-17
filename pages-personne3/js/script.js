// script des pages accueil, fiche commerce et panier - Personne 3
// pas de base de données : les produits sont écrits ici et le panier est gardé dans le localStorage

// liste des produits (fausses données)
let catalogue = {
  "pain-complet": { nom: "Pain complet", prix: 2.50, image: "images/pain-complet.jpg", commerce: "Boulangerie des Lilas" },
  "croissant": { nom: "Croissant", prix: 1.20, image: "images/croissant.jpg", commerce: "Boulangerie des Lilas" },
  "pain-chocolat": { nom: "Pain au chocolat", prix: 1.35, image: "images/pain-chocolat.jpg", commerce: "Boulangerie des Lilas" },
  "tarte-pommes": { nom: "Tarte aux pommes", prix: 3.80, image: "images/tarte-pommes.jpg", commerce: "Boulangerie des Lilas" },
  "eclair": { nom: "Éclair au chocolat", prix: 2.80, image: "images/eclair.jpg", commerce: "Boulangerie des Lilas" },
  "macarons": { nom: "Macarons (x6)", prix: 6.50, image: "images/macarons.jpg", commerce: "Boulangerie des Lilas" },
  "tomates-cerises": { nom: "Tomates cerises", prix: 2.50, image: "images/tomates.jpg", commerce: "Primeur du Marché" },
  "avocat": { nom: "Avocat", prix: 2.30, image: "images/avocat.jpg", commerce: "Primeur du Marché" }
};

// lit le panier enregistré (une liste de { id, quantite })
function lirePanier() {
  let texte = localStorage.getItem("panier");
  if (texte === null) {
    return [];
  }
  // on garde seulement les produits qui existent dans le catalogue
  let panier = JSON.parse(texte);
  let panierValide = [];
  for (let i = 0; i < panier.length; i++) {
    if (catalogue[panier[i].id] !== undefined) {
      panierValide.push(panier[i]);
    }
  }
  return panierValide;
}

// enregistre le panier et met à jour le petit chiffre sur l'icône
function enregistrerPanier(panier) {
  localStorage.setItem("panier", JSON.stringify(panier));
  afficherNombre(panier);
}

// nombre total d'articles dans le panier
function compterArticles(panier) {
  let total = 0;
  for (let i = 0; i < panier.length; i++) {
    total += panier[i].quantite;
  }
  return total;
}

// affiche le nombre d'articles sur l'icône du panier
function afficherNombre(panier) {
  let pastilles = document.querySelectorAll(".cart-count");
  for (let i = 0; i < pastilles.length; i++) {
    pastilles[i].textContent = compterArticles(panier);
  }
}

// écrit un prix au format français : 2.5 devient "2,50 €"
function formatPrix(nombre) {
  return nombre.toFixed(2).replace(".", ",") + " €";
}

// affiche "Produit ajouté au panier - Voir mon panier" pendant 3 secondes
let minuteur;
function afficherNotification(nomProduit) {
  let notif = document.querySelector(".notification");
  if (notif === null) {
    notif = document.createElement("div");
    notif.className = "notification";
    document.body.appendChild(notif);
  }
  notif.innerHTML = "<span>✓ " + nomProduit + " ajouté au panier</span><a href=\"panier.html\">Voir mon panier →</a>";
  notif.classList.add("visible");
  clearTimeout(minuteur);
  minuteur = setTimeout(function () {
    notif.classList.remove("visible");
  }, 3000);
}

// ----- fiche commerce : boutons "Ajouter au panier" -----
let boutonsAjouter = document.querySelectorAll(".ajouter");
for (let i = 0; i < boutonsAjouter.length; i++) {
  boutonsAjouter[i].addEventListener("click", function () {
    let bouton = this;
    let id = bouton.dataset.produit;
    let panier = lirePanier();

    // si le produit est déjà dans le panier, on ajoute 1, sinon on l'ajoute
    let trouve = false;
    for (let j = 0; j < panier.length; j++) {
      if (panier[j].id === id) {
        panier[j].quantite++;
        trouve = true;
      }
    }
    if (!trouve) {
      panier.push({ id: id, quantite: 1 });
    }
    enregistrerPanier(panier);

    // petit message en bas de la page avec un lien vers le panier
    afficherNotification(catalogue[id].nom);

    // petit message sur le bouton pendant 1 seconde
    let texteAvant = bouton.textContent;
    bouton.textContent = "Ajouté ✓";
    setTimeout(function () {
      bouton.textContent = texteAvant;
    }, 1000);
  });
}

// ----- fiche commerce : onglets Produits / Avis / Informations -----
let onglets = document.querySelectorAll(".onglet");
for (let i = 0; i < onglets.length; i++) {
  onglets[i].addEventListener("click", function () {
    // on enlève "active" de tous les onglets et on cache tous les contenus
    for (let j = 0; j < onglets.length; j++) {
      onglets[j].classList.remove("actif");
      document.getElementById(onglets[j].dataset.onglet).classList.add("cache");
    }
    // puis on affiche l'onglet cliqué
    this.classList.add("actif");
    document.getElementById(this.dataset.onglet).classList.remove("cache");
  });
}

// ----- page panier -----
function afficherPanier() {
  let zone = document.getElementById("liste-panier");
  if (zone === null) {
    return; // on n'est pas sur la page panier
  }

  let panier = lirePanier();
  zone.innerHTML = "";

  // panier vide
  if (panier.length === 0) {
    zone.innerHTML = '<div class="panier-vide"><div>🛍️</div><h2>Votre panier est vide</h2>' +
      '<p>Découvrez les commerces de votre quartier.</p>' +
      '<a class="bouton-plein petit" href="index.html#commerces">Découvrir les commerces</a></div>';
  }

  // on range les produits par commerce
  let commerces = {};
  for (let i = 0; i < panier.length; i++) {
    let nomCommerce = catalogue[panier[i].id].commerce;
    if (commerces[nomCommerce] === undefined) {
      commerces[nomCommerce] = [];
    }
    commerces[nomCommerce].push(panier[i]);
  }

  // un bloc par commerce, une ligne par produit
  for (let nomCommerce in commerces) {
    let html = '<div class="commerce-panier"><h2>' + nomCommerce + '</h2>';
    let lignes = commerces[nomCommerce];
    for (let i = 0; i < lignes.length; i++) {
      let produit = catalogue[lignes[i].id];
      let quantite = lignes[i].quantite;
      html += '<div class="ligne-panier">' +
        '<img src="' + produit.image + '" alt="' + produit.nom + '">' +
        '<div><b>' + produit.nom + '</b><small>' + formatPrix(produit.prix) + ' × ' + quantite + '</small></div>' +
        '<div class="quantite"><button data-action="moins" data-id="' + lignes[i].id + '">−</button>' +
        '<span>' + quantite + '</span>' +
        '<button data-action="plus" data-id="' + lignes[i].id + '">+</button></div>' +
        '<b class="prix-ligne">' + formatPrix(produit.prix * quantite) + '</b>' +
        '<button class="supprimer" data-action="supprimer" data-id="' + lignes[i].id + '" title="Supprimer">✕</button>' +
        '</div>';
    }
    html += '</div>';
    zone.innerHTML += html;
  }

  // récapitulatif
  let sousTotal = 0;
  for (let i = 0; i < panier.length; i++) {
    sousTotal += catalogue[panier[i].id].prix * panier[i].quantite;
  }
  document.getElementById("nb-articles").textContent = compterArticles(panier);
  document.getElementById("sous-total").textContent = formatPrix(sousTotal);
  document.getElementById("total").textContent = formatPrix(sousTotal);

  // on ne peut pas commander un panier vide
  let boutonCommander = document.getElementById("commander");
  if (panier.length === 0) {
    boutonCommander.classList.add("vide");
  } else {
    boutonCommander.classList.remove("vide");
  }

  afficherNombre(panier);
}

// boutons +, - et supprimer du panier
let listePanier = document.getElementById("liste-panier");
if (listePanier !== null) {
  listePanier.addEventListener("click", function (e) {
    let bouton = e.target.closest("button");
    if (bouton === null) {
      return;
    }
    let panier = lirePanier();
    let id = bouton.dataset.id;
    let nouveauPanier = [];

    for (let i = 0; i < panier.length; i++) {
      if (panier[i].id === id) {
        if (bouton.dataset.action === "plus") {
          panier[i].quantite++;
        } else if (bouton.dataset.action === "moins") {
          panier[i].quantite--;
        } else {
          panier[i].quantite = 0; // supprimer
        }
      }
      // on garde seulement les produits qui ont encore une quantité
      if (panier[i].quantite > 0) {
        nouveauPanier.push(panier[i]);
      }
    }

    enregistrerPanier(nouveauPanier);
    afficherPanier();
  });
}

// ----- menu sur téléphone -----
let boutonMenu = document.querySelector(".bouton-menu");
if (boutonMenu !== null) {
  boutonMenu.addEventListener("click", function () {
    document.querySelector(".menu").classList.toggle("ouvert");
  });
}

// ----- au chargement -----
// pour la démo, on met quelques produits si le panier n'a jamais été utilisé
if (document.body.dataset.page === "panier" && localStorage.getItem("panier") === null) {
  enregistrerPanier([
    { id: "croissant", quantite: 2 },
    { id: "pain-complet", quantite: 1 },
    { id: "tomates-cerises", quantite: 2 },
    { id: "avocat", quantite: 1 }
  ]);
}

afficherNombre(lirePanier());
afficherPanier();

// ----- accueil : coeur des favoris -----
let coeurs = document.querySelectorAll(".favori");
for (let i = 0; i < coeurs.length; i++) {
  coeurs[i].addEventListener("click", function () {
    this.classList.toggle("aime");
    if (this.classList.contains("aime")) {
      this.textContent = "♥";
    } else {
      this.textContent = "♡";
    }
  });
}
