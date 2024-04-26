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

//Cette fonction permet d'appeler les media pour un photographe.
async function getMediaForPhotographer(photographerId) {
  const url = "/data/photographers.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Impossible de chargé les données");
    }
    const data = await response.json();
    //On retourne le média qui correspond à l'id du photographe.
    return data.media.filter((item) => item.photographerId === photographerId);
  } catch (error) {
    console.error("Une erreur est survenue lors du chargement du JSON", error);
    return [];
  }
}

// Création de la media factory
class MediaFactory {
  static createMediaElement(media, photographerId) {
    const basePath = `./assets/images/${photographerId}/`;
    //Si un média est une image
    if (media.image) {
      // Nous créons un element image
      const img = document.createElement("img");
      // Avec comme source le chemin des image correspondant à l'id
      img.src = `${basePath}${media.image}`;
      // Avec la description correspondante
      img.alt = media.title;
      return img;
      // Si le media est une vidéo
    } else if (media.video) {
      //Nous créons un element vidéo
      const video = document.createElement("video");
      video.src = `${basePath}${media.video}`;
      video.controls = true;
      return video;
    }
    //Si le média n'est pas supporté , exemple : un audio alors message d'erreur
    throw new Error("Type de media non supporté");
  }
}

//Fonction qui prends en compte l'id du photographe
async function displayPhotographerAlbum(photographerId) {
  // Ici on créer une constant pour appeler notre fonction fetch
  const mediaItems = await getMediaForPhotographer(photographerId);
  // Ici nous selectionnant un element du Dom avec album container
  const albumContainer = document.querySelector(".album-container");
  mediaItems.forEach((media) => {
    try {
      // Ici nous appelons notre class MediaFactory avec comme parametre media et l'id du photographe
      const mediaElement = MediaFactory.createMediaElement(
        media,
        photographerId
      );
      // Nous l'intégrerons dans l'element du dom avec la classe album-container
      albumContainer.appendChild(mediaElement);
    } catch (error) {
      console.error(error);
    }
  });
}
// Cette fonction permet d'afficher le profil d'un seul photographe
async function displayPhotographer() {
  let urlParams = new URLSearchParams(location.search);
  let id = urlParams.get("id");
  // Nous appelons notre fetch
  const photographers = await getPhotographers();
  // Ici je selectionne des elements avec differente classe dans le dom
  const textPhotographer = document.querySelector(".text-profil");
  const photographerHeader = document.querySelector(".photograph-header");
  // La nous cherchons un id correspondant au photographe a afficher en nous basant sur l'id transporter par l'url et stocker dans la variable id
  const photographer = photographers.find((p) => p.id.toString() === id);
  //Si il y a bien un photographe sous cet id
  if (photographer) {
    //Nous création les differents element dans le DOM , tel que le portrait , la description , la citation et la localisation
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
    // et nous les affichons  dans le Dom
    photographerHeader.appendChild(profilePicture);
    textPhotographer.appendChild(profileName);
    textPhotographer.appendChild(profilCity);
    textPhotographer.appendChild(profileTag);
    // Ici nous appelons notre fonction qui affiche l'album avec le parametre l'id du photographe
    displayPhotographerAlbum(photographer.id);
  } else {
    let profileName = document.createElement("h1");
    profileName.textContent = "Aucun photographe sous cet id";
    profileName.ariaLabel = "Message d'erreur : Aucun photographe sous cet id";
    textPhotographer.appendChild(profileName);
    console.log("Aucun photographe n'est accessible sur cet id");
  }
}
// Ici nous appelons notre fonction qui englobe tout
displayPhotographer();
