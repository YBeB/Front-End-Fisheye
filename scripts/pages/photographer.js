// Variables globales
let currentMediaMap = new Map();
let totalLikes = 0;

// Fonction pour récupérer des données depuis le fichier JSON
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
  return data
    ? data.media.filter((item) => item.photographerId === photographerId)
    : [];
}

// Fonction pour créer un élément média
function createMediaElement(media, photographerId) {
  const basePath = `./assets/images/${photographerId}/`;
  const element = media.image
    ? document.createElement("img")
    : document.createElement("video");
  element.src = `${basePath}${media.image || media.video}`;
  element.alt = media.title;
  if (media.video) element.controls = true;

  const likeButton = document.createElement("img");
  likeButton.src = "./assets/icons/heart.svg";
  likeButton.style.width = "30px";
  likeButton.style.height = "30px";
  likeButton.style.cursor = "pointer";
  likeButton.style.marginRight = "10px";
  likeButton.onclick = (event) => {
    event.stopPropagation(); // Empêche le clic de se propager et d'ouvrir la lightbox
    toggleLike(media);
  };

  const likesCount = document.createElement("span");
  likesCount.textContent = `${media.likes}`;
  likesCount.className = "likes-count";

  const mediaTitle = document.createElement("span");
  mediaTitle.textContent = media.title;
  mediaTitle.className = "media-title";

  const likeContainer = document.createElement("div");
  likeContainer.style.display = "flex";
  likeContainer.style.alignItems = "center";
  likeContainer.append(likeButton, likesCount);

  const controlsContainer = document.createElement("div");
  controlsContainer.style.display = "flex";
  controlsContainer.style.alignItems = "center";
  controlsContainer.style.justifyContent = "space-between";
  controlsContainer.style.color = "#901C1C";
  controlsContainer.append(mediaTitle, likeContainer);

  const container = document.createElement("div");
  container.append(element, controlsContainer);
  container.addEventListener("click", () => openLightbox(media.id));

  return container;
}

// Fonction pour basculer les likes
function toggleLike(media) {
  media.likes += media.likedByUser ? -1 : 1;
  totalLikes += media.likedByUser ? -1 : 1;
  media.likedByUser = !media.likedByUser;
  updateLikesDisplay(media);
  updateTotalLikesDisplay();
}

function updateLikesDisplay(media) {
  const mediaContainer = currentMediaMap.get(media.id).element;
  const likesCountElement = mediaContainer.querySelector(".likes-count");
  likesCountElement.textContent = `${media.likes}`;
}

function updateTotalLikesDisplay() {
  const totalLikesElement = document.getElementById("total-likes");
  totalLikesElement.textContent = `Total Likes: ${totalLikes}`;
}

function closeLightbox() {
  document.getElementById("light-box").style.display = "none";
}

// Fonctions pour naviguer entre les médias dans la lightbox
function openLightbox(mediaId) {
  const media = currentMediaMap.get(mediaId);
  if (!media) return;

  const lightbox = document.getElementById("light-box");
  lightbox.style.display = "block";
  const mediaContainer = document.getElementById("lightbox-media-container");
  mediaContainer.innerHTML = "";
  mediaContainer.appendChild(media.element.firstChild.cloneNode(true));
}

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

// Affichage des informations et de l'album du photographe
async function displayPhotographer() {
  let urlParams = new URLSearchParams(location.search);
  let id = urlParams.get("id");
  const photographers = await getPhotographers();
  const photographer = photographers.find((p) => p.id.toString() === id);
  const textPhotographer = document.querySelector(".text-profil");
  const photographerHeader = document.querySelector(".photograph-header");

  if (photographer) {
    const mediaItems = await getMediaForPhotographer(photographer.id);
    totalLikes = mediaItems.reduce((acc, media) => acc + media.likes, 0);
    updateTotalLikesDisplay();


    const albumContainer = document.querySelector(".album-container");
    albumContainer.innerHTML = "";
    mediaItems.forEach((media, index) => {
      const mediaElement = createMediaElement(media, photographer.id);
      mediaElement.addEventListener("click", () => openLightbox(media.id));
      albumContainer.appendChild(mediaElement);
      currentMediaMap.set(media.id, {
        element: mediaElement,
        nextId: mediaItems[index + 1] ? mediaItems[index + 1].id : null,
        prevId: index > 0 ? mediaItems[index - 1].id : null,
      });
    });

    let profilePicture = document.createElement("img");
    profilePicture.src = `./assets/photographers/${photographer.portrait}`;
    profilePicture.classList.add("profilePicture");
    profilePicture.alt = `Portrait de ${photographer.name}`;

    let profileName = document.createElement("h1");
    profileName.textContent = photographer.name;

    let profilCity = document.createElement("h2");
    profilCity.textContent = `${photographer.city}, ${photographer.country}`;

    photographerHeader.appendChild(profilePicture);
    textPhotographer.appendChild(profileName);
    textPhotographer.appendChild(profilCity);
  } else {
    let profileName = document.createElement("h1");
    profileName.textContent = "Aucun photographe trouvé pour cet ID";
    textPhotographer.appendChild(profileName);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  displayPhotographer();
});
