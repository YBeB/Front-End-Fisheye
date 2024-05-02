// Création d'un tableau et d'un index pour parcourir les media via lightbox
let currentMediaItems = [];
let currentIndex = 0;

// Lance une requête pour récupérer les données des photographes depuis le fichier JSON.
async function getPhotographers() {
  const url = "/data/photographers.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Impossible de charger les données");
    }
    const data = await response.json();
    return data.photographers;
  } catch (error) {
    console.error("Une erreur est survenue lors du chargement du JSON", error);
    return [];
  }
}
// Gère l'affichage de la lightbox pour les médias
function openLightbox(index) {
  const media = currentMediaItems[index];
  const lightbox = document.getElementById("light-box");
  const mediaContainer = document.getElementById("lightbox-media-container");
  const basePath = `./assets/images/${media.photographerId}/`;
  let mediaElement;

  mediaContainer.innerHTML = "";

  if (media.image) {
    mediaElement = document.createElement("img");
    mediaElement.src = `${basePath}${media.image}`;
    mediaElement.alt = media.title;
  } else if (media.video) {
    mediaElement = document.createElement("video");
    mediaElement.src = `${basePath}${media.video}`;
    mediaElement.controls = true;
    mediaElement.alt = media.title;
  }

  mediaContainer.appendChild(mediaElement);

  lightbox.style.display = "block";
}
// Fonction permettant d'aller dans le média suivant
function nextMedia() {
  if (currentIndex < currentMediaItems.length - 1) {
    currentIndex++;
    openLightbox(currentIndex);
  }
}
// Fonction permettant d'aller dans le media precedent
function previousMedia() {
  if (currentIndex > 0) {
    currentIndex--;
    openLightbox(currentIndex);
  }
}
//Recherche des médias (photos et vidéos ) qui sont associés à l'ID du photographe.
async function getMediaForPhotographer(photographerId) {
  const url = "/data/photographers.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Impossible de charger les données");
    }
    const data = await response.json();
    return data.media.filter((item) => item.photographerId === photographerId);
  } catch (error) {
    console.error("Une erreur est survenue lors du chargement du JSON", error);
    return [];
  }
}

// Factory pour créer les éléments multimédia (image ou vidéo) en fonction du type de média.
class MediaFactory {
  static createMediaElement(media, photographerId) {
    const basePath = `./assets/images/${photographerId}/`;
    //Si un média est une image
    if (media.image) {
      const img = document.createElement("img");
      img.src = `${basePath}${media.image}`;
      // Retourne un élément img configuré.
      img.alt = media.title;
      return img;
    } else if (media.video) {
      const video = document.createElement("video");
      video.src = `${basePath}${media.video}`;
      video.controls = true;
      // Retourne un élément video configuré.
      return video;
    } else {
      throw new Error("Type de media non supporté");
    }
  }
}
//Fonction pour fermer la lightbox associé a la croix
function closeLightbox() {
  const lightbox = document.getElementById("light-box");
  lightbox.style.display = "none";
}

//Fonction qui permet d'identifie les photo de l'album via l'id du photographe
async function displayPhotographerAlbum(photographerId) {
  const mediaItems = await getMediaForPhotographer(photographerId);
  currentMediaItems = mediaItems;
  const albumContainer = document.querySelector(".album-container");
  albumContainer.innerHTML = "";
  mediaItems.forEach((media, index) => {
    try {
      const mediaElement = MediaFactory.createMediaElement(
        media,
        photographerId
      );
      mediaElement.addEventListener("click", () => {
        currentIndex = index;
        openLightbox(index);
      });
      albumContainer.appendChild(mediaElement);
    } catch (error) {
      console.error(error);
    }
  });
}
// Fonction pour affiché les informations et l'album du photographe
async function displayPhotographer() {
  let urlParams = new URLSearchParams(location.search);
  let id = urlParams.get("id");
  const photographers = await getPhotographers();
  const textPhotographer = document.querySelector(".text-profil");
  const photographerHeader = document.querySelector(".photograph-header");
  const contactMe = document.querySelector(".contact-me");
  const photographer = photographers.find((p) => p.id.toString() === id);
  if (photographer) {
    let profilePicture = document.createElement("img");
    profilePicture.src = `./assets/photographers/${photographer.portrait}`;
    profilePicture.classList.add("profilePicture");
    profilePicture.alt = `Portrait de ${photographer.name}`;
    profilePicture.setAttribute(
      "aria-label",
      `Portrait de ${photographer.name}`
    );

    let profileName = document.createElement("h1");
    profileName.textContent = photographer.name;

    let profileTag = document.createElement("p");
    profileTag.setAttribute("aria-label", `Citation: ${photographer.tagline}`);
    profileTag.textContent = photographer.tagline;

    let profilCity = document.createElement("h2");
    profilCity.textContent = `${photographer.city}, ${photographer.country}`;
    profilCity.setAttribute(
      "aria-label",
      `Localisation: ${photographer.city}, ${photographer.country}`
    );

    contactMe.textContent = `Contactez-moi ${photographer.name}`;
    contactMe.setAttribute("aria-label", `Contactez-moi ${photographer.name}`);

    photographerHeader.appendChild(profilePicture);
    textPhotographer.appendChild(profileName);
    textPhotographer.appendChild(profilCity);
    textPhotographer.appendChild(profileTag);
    displayPhotographerAlbum(photographer.id);
  } else {
    let profileName = document.createElement("h1");
    profileName.textContent = "Aucun photographe trouvé pour cet ID";
    profileName.setAttribute(
      "aria-label",
      "Message d'erreur : Aucun photographe trouvé pour cet ID"
    );
    textPhotographer.appendChild(profileName);
    console.log("Aucun photographe n'est accessible sur cet ID");
  }
}

displayPhotographer();
