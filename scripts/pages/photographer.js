// Variables globales
const currentMediaMap = new Map();
let currentIndex = null;
let totalLikes = 0;
let photographerPrice = 0;
let mediaItems = [];

// Fonction pour récupérer des données JSON
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Impossible de charger les données");
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur lors du chargement du JSON", error);
    return null;
  }
}

// Fonction pour obtenir les photographes
async function getPhotographers() {
  const data = await fetchData("/data/photographers.json");
  return data ? data.photographers : [];
}

// Fonction pour obtenir les médias d'un photographe
async function getMediaForPhotographer(photographerId) {
  const data = await fetchData("/data/photographers.json");
  return data ? data.media.filter((item) => item.photographerId === photographerId) : [];
}

// Classe de base pour les médias
class Media {
  constructor(media, photographerId) {
    this.media = media;
    this.photographerId = photographerId;
  }

  createElement() {
    throw new Error("Méthode createElement() non implémentée");
  }

  createLikeButton() {
    const likeButton = document.createElement("img");
    likeButton.src = this.media.likedByUser ? "./assets/icons/heart-filled.svg" : "./assets/icons/heart.svg";
    likeButton.setAttribute("role", "button");
    likeButton.setAttribute("aria-pressed", this.media.likedByUser ? "true" : "false");
    likeButton.setAttribute("tabindex", "0");
    likeButton.style = "width: 30px; height: 30px; cursor: pointer; margin-right: 10px;";
    likeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleLike(this.media);
    });
    likeButton.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        toggleLike(this.media);
      }
    });
    return likeButton;
  }

  createLikesCount() {
    const likesCount = document.createElement("span");
    likesCount.textContent = `${this.media.likes}`;
    likesCount.className = "likes-count";
    likesCount.setAttribute("aria-label", `Total de likes pour ${this.media.title}`);
    return likesCount;
  }

  createMediaTitle() {
    const mediaTitle = document.createElement("span");
    mediaTitle.textContent = this.media.title;
    mediaTitle.className = "media-title";
    return mediaTitle;
  }

  createContainer(element, controlsContainer) {
    const container = document.createElement("article");
    container.append(element, controlsContainer);
    container.addEventListener("click", () => openLightbox(this.media.id));
    container.setAttribute("role", "article");
    container.setAttribute("aria-labelledby", this.media.title);
    container.setAttribute("tabindex", "0");
    container.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        openLightbox(this.media.id);
      }
    });
    return container;
  }
}

// Classe pour les images
class ImageMedia extends Media {
  createElement() {
    const element = document.createElement("img");
    element.src = `./assets/images/${this.photographerId}/${this.media.image}`;
    element.alt = this.media.title;
    element.setAttribute("role", "img");
    element.setAttribute("aria-label", `Image de ${this.media.title}`);
    return element;
  }
}

// Classe pour les vidéos
class VideoMedia extends Media {
  createElement() {
    const element = document.createElement("video");
    element.src = `./assets/images/${this.photographerId}/${this.media.video}`;
    element.alt = this.media.title;
    element.setAttribute("role", "video");
    element.setAttribute("aria-label", `Vidéo de ${this.media.title}`);
    element.controls = true;
    return element;
  }
}

// Factory de médias
class MediaFactory {
  static createMedia(media, photographerId) {
    let mediaInstance;
    if (media.image) {
      mediaInstance = new ImageMedia(media, photographerId);
    } else if (media.video) {
      mediaInstance = new VideoMedia(media, photographerId);
    } else {
      throw new Error("Type de média inconnu");
    }

    const element = mediaInstance.createElement();
    const likeButton = mediaInstance.createLikeButton();
    const likesCount = mediaInstance.createLikesCount();
    const mediaTitle = mediaInstance.createMediaTitle();

    const likeContainer = document.createElement("div");
    likeContainer.style = "display: flex; align-items: center;";
    likeContainer.append(likeButton, likesCount);

    const controlsContainer = document.createElement("div");
    controlsContainer.style = "display: flex; align-items: center; justify-content: space-between; color: #901C1C;";
    controlsContainer.append(mediaTitle, likeContainer);

    return mediaInstance.createContainer(element, controlsContainer);
  }
}

// Fonction pour créer un élément média
function createMediaElement(media, photographerId) {
  return MediaFactory.createMedia(media, photographerId);
}

// Fonction pour basculer les likes
function toggleLike(media) {
  const change = media.likedByUser ? -1 : 1;
  media.likes += change;
  totalLikes += change;
  media.likedByUser = !media.likedByUser;
  updateLikesDisplay(media);
  updateTotalLikesDisplay();
  updateLikeButton(media);
}

// Met à jour l'affichage des likes pour un média spécifique
function updateLikesDisplay(media) {
  const mediaContainer = currentMediaMap.get(media.id).element;
  const likesCountElement = mediaContainer.querySelector(".likes-count");
  likesCountElement.textContent = `${media.likes}`;
}

// Met à jour l'affichage total des likes
function updateTotalLikesDisplay() {
  const totalLikesElement = document.getElementById("total-likes");
  totalLikesElement.innerHTML = ""; 

  const likesText = document.createTextNode(`${totalLikes} likes `);

  const totalLikeImage = document.createElement("img");
  totalLikeImage.src = "./assets/icons/heart.svg";
  totalLikeImage.alt = "Cœur";
  totalLikeImage.style = "width: 20px; vertical-align: middle; margin-left: 5px; margin-right: 30px;";

  const priceText = document.createTextNode(` ${photographerPrice}€/jour`);

  totalLikesElement.appendChild(likesText);
  totalLikesElement.appendChild(totalLikeImage);
  totalLikesElement.appendChild(priceText);
}

// Met à jour l'affichage du bouton de like
function updateLikeButton(media) {
  const mediaContainer = currentMediaMap.get(media.id).element;
  const likeButton = mediaContainer.querySelector('[role="button"]');
  likeButton.src = media.likedByUser ? "./assets/icons/heart-filled.svg" : "./assets/icons/heart.svg";
  likeButton.setAttribute("aria-pressed", media.likedByUser ? "true" : "false");
}

// Fonction pour ouvrir la lightbox
function openLightbox(mediaId) {
  currentIndex = mediaId;
  const media = currentMediaMap.get(mediaId);
  if (!media) return;

  const lightbox = document.getElementById("light-box");
  lightbox.style.display = "block";
  const mediaContainer = document.getElementById("lightbox-media-container");
  mediaContainer.innerHTML = "";
  mediaContainer.appendChild(media.element.firstChild.cloneNode(true));

}

// Fonction pour fermer la lightbox
function closeLightbox() {
  document.getElementById("light-box").style.display = "none";
}

// Fonctions pour naviguer entre les médias dans la lightbox
function nextMedia() {
  const currentMedia = currentMediaMap.get(currentIndex);
  if (currentMedia && currentMedia.nextId) {
    openLightbox(currentMedia.nextId);
  }
}

function previousMedia() {
  const currentMedia = currentMediaMap.get(currentIndex);
  if (currentMedia && currentMedia.prevId) {
    openLightbox(currentMedia.prevId);
  }
}

// Fonction pour trier les médias
function sortMediaItems(criteria) {
  switch (criteria) {
    case "date":
      mediaItems.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case "popularity":
      mediaItems.sort((a, b) => b.likes - a.likes);
      break;
    case "name":
      mediaItems.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      break;
  }
  displaySortedMediaItems();
}

// Fonction pour afficher les médias triés
function displaySortedMediaItems() {
  const albumContainer = document.querySelector(".album-container");
  albumContainer.innerHTML = "";
  mediaItems.forEach((media, index) => {
    const mediaElement = createMediaElement(media, media.photographerId);
    mediaElement.addEventListener("click", () => openLightbox(media.id));
    albumContainer.appendChild(mediaElement);
    currentMediaMap.set(media.id, {
      element: mediaElement,
      nextId: mediaItems[index + 1] ? mediaItems[index + 1].id : null,
      prevId: index > 0 ? mediaItems[index - 1].id : null,
    });
  });
}

// Fonction pour afficher les informations du photographe
async function displayPhotographer() {
  const urlParams = new URLSearchParams(location.search);
  const id = urlParams.get("id");
  const photographers = await getPhotographers();
  const photographer = photographers.find((p) => p.id.toString() === id);
  const textPhotographer = document.querySelector(".text-profil");
  const photographerHeader = document.querySelector(".photograph-header");

  if (photographer) {
    photographerPrice = photographer.price;
    mediaItems = await getMediaForPhotographer(photographer.id);
    totalLikes = mediaItems.reduce((acc, media) => acc + media.likes, 0);
    updateTotalLikesDisplay();

    displaySortedMediaItems();

    const profilePicture = document.createElement("img");
    profilePicture.src = `./assets/photographers/${photographer.portrait}`;
    profilePicture.classList.add("profilePicture");
    profilePicture.alt = `Portrait de ${photographer.name}`;

    const profileName = document.createElement("h1");
    profileName.textContent = photographer.name;

    const profilCity = document.createElement("h2");
    profilCity.textContent = `${photographer.city}, ${photographer.country}`;

    const profileContact = document.querySelector(".contact-me");
    profileContact.innerHTML = `Contactez moi ${photographer.name}`;
    profileContact.style = "font-size:40px";
    photographerHeader.appendChild(profilePicture);
    textPhotographer.appendChild(profileName);
    textPhotographer.appendChild(profilCity);
  } else {
    const profileName = document.createElement("h1");
    profileName.textContent = "Aucun photographe trouvé pour cet ID";
    textPhotographer.appendChild(profileName);
  }
}

// Ajoute un écouteur d'événement pour le changement de tri
document.getElementById("sort-criteria").addEventListener("change", (event) => {
  sortMediaItems(event.target.value);
});

// Affiche le photographe lors du chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  displayPhotographer();
});

// Ajoute des gestionnaires d'événements pour la navigation au clavier
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  } else if (event.key === "ArrowRight") {
    nextMedia();
  } else if (event.key === "ArrowLeft") {
    previousMedia();
  }
});
