// Je créer une fonction qui fait appel a mon json avec un fetch
async function getPhotographers() {
  const url = "/data/photographers.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Impossible de chargé les données");
    }
    const data = await response.json();
    return data.photographers;
  } catch (error) {
    console.error("Une erreur est survenue lors du chargement du JSON", error);
    return [];
  }
}

async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");

  photographers.forEach((photographer) => {
    // Creation dans le DOM d'un article avec une classe photographer-card
    const photographArticle = document.createElement("article");
    photographArticle.classList.add("photographer-card");

    // Création d'un lien qui emmene les utilisateurs dans leur page respective
    const photographLink = document.createElement("a");
    photographLink.href = `photographer.html?id=${photographer.id}`;

    // Création d'un element image avec comme source les images dans assets/photographers et avec la description portrait suivi du nom
    const photographerImage = document.createElement("img"); // Fixed variable name here
    photographerImage.src = `./assets/photographers/${photographer.portrait}`;
    photographerImage.alt = `Portrait de ${photographer.name}`; // Good practice to include an alt attribute for accessibility

    // Création de h2 pour affiché le nom et prénom des photographes
    const namePhotographer = document.createElement("h2");
    namePhotographer.textContent = `${photographer.name}`;

    // Ici je créer un element h4 pour affiché la réplique de chaque photographe
    const citationPhotographer = document.createElement("h4");
    citationPhotographer.textContent = photographer.tagline;
    
    //ici on associe le lien avec l'image et le nom
    photographLink.appendChild(photographerImage);
    photographLink.appendChild(namePhotographer);

    // Création de h3 pour affiché la ville et le pays de chaque photographe
    const cityPhotographer = document.createElement("h3");
    cityPhotographer.textContent = `${photographer.city}, ${photographer.country}`;


    // Je créer un element p pour y affiché le prix
    const photographerPrice = document.createElement("p");
    photographerPrice.textContent = `${photographer.price}€/jour`;
    // J'englobe tout  dans l'element article
    photographArticle.appendChild(photographLink);
    photographArticle.appendChild(cityPhotographer);
    photographArticle.appendChild(citationPhotographer);
    photographArticle.appendChild(photographerPrice);

    // ici nous mettons l'article dans la section
    photographersSection.appendChild(photographArticle);
  });
}

async function init() {
  try {
    const photographers = await getPhotographers();
    if (photographers.length > 0) {
      displayData(photographers);
    }
  } catch (error) {
    console.error("Failed to initialize data", error);
  }
}

init();
