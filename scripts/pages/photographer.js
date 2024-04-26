// // Lance une requête pour récupérer les données des photographes depuis le fichier JSON.
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

//Recherche des médias (photos et vidéos ) qui sont associés à l'ID du photographe.  
async function getMediaForPhotographer(photographerId) {
  const url = "/data/photographers.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Impossible de chargé les données");
    }
    const data = await response.json();
     // Filtre et retourne uniquement les médias correspondant à l'ID du photographe.
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
    }
    //Si le média n'est pas supporté , exemple : un audio alors message d'erreur
    throw new Error("Type de media non supporté");
  }
}

//Affiche l'album d'un photographe dans le DOM 
async function displayPhotographerAlbum(photographerId) {
  const mediaItems = await getMediaForPhotographer(photographerId);
  const albumContainer = document.querySelector(".album-container");
  mediaItems.forEach((media) => {
    try {
    // Crée un élément média et l'ajoute au conteneur d'album.
      const mediaElement = MediaFactory.createMediaElement(
        media,
        photographerId
      );
      albumContainer.appendChild(mediaElement);
    } catch (error) {
      console.error(error);
    }
  });
}
// Affiche les informations du photographe sélectionné ainsi que son album.
async function displayPhotographer() {
  let urlParams = new URLSearchParams(location.search);
  let id = urlParams.get("id");
  const photographers = await getPhotographers();
  const textPhotographer = document.querySelector(".text-profil");
  const photographerHeader = document.querySelector(".photograph-header");
  const photographer = photographers.find((p) => p.id.toString() === id);
  if (photographer) {
    // Création et affichage des éléments du profil du photographe.
    let profilePicture = document.createElement("img");
    profilePicture.src = `./assets/photographers/${photographer.portrait}`;
    profilePicture.classList.add("profilePicture");
    profilePicture.alt = `Portrait de ${photographer.name}`;
    profilePicture.ariaLabel = `Portrait de ${photographer.name}`;

    let profileName = document.createElement("h1");
    profileName.textContent = photographer.name;

    let profileTag = document.createElement("p");
    profileTag.ariaLabel = `Citation: ${photographer.tagline}`;
    profileTag.textContent = photographer.tagline;

    let profilCity = document.createElement("h2");
    profilCity.textContent = `${photographer.city}, ${photographer.country}`;
    profilCity.ariaLabel = `Localisation: ${photographer.city}, ${photographer.country}`;

    photographerHeader.appendChild(profilePicture);
    textPhotographer.appendChild(profileName);
    textPhotographer.appendChild(profilCity);
    textPhotographer.appendChild(profileTag);
    // Appel de la fonction d'affichage de l'album.
    displayPhotographerAlbum(photographer.id);
  } else {
    // S'il y a absence du photographe pour l'ID donné, affichage d'un message d'erreur.
    let profileName = document.createElement("h1");
    profileName.textContent = "Aucun photographe sous cet id";
    profileName.ariaLabel = "Message d'erreur : Aucun photographe sous cet id";
    textPhotographer.appendChild(profileName);
    console.log("Aucun photographe n'est accessible sur cet id");
  }
}
// Initialisation de l'affichage du photographe.
displayPhotographer();
