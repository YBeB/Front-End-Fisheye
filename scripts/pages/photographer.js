var urlParams = new URLSearchParams(location.search);
let id = urlParams.get("id");

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

async function displayPhotographer() {
  const photographers = await getPhotographers();
  const photographerHeader = document.querySelector(".photograph-header");
  const photographer = photographers.find((p) => p.id.toString() === id);
  if (photographer) {
    let profilePicture = document.createElement("img");
    profilePicture.src = `./assets/photographers/${photographer.portrait}`;
    profilePicture.classList.add("profilePicture");
    profilePicture.setAttribute("alt", `Portrait de ${photographer.name}`);
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
    profilCity.textContent = `${photographer.city},${photographer.country}`;
    profilCity.setAttribute(
      "aria-label",
      `Localisation: ${photographer.city}, ${photographer.country}`
    );

    photographerHeader.appendChild(profilePicture);
    textPhotographer.appendChild(profileName);
    textPhotographer.appendChild(profilCity);
    textPhotographer.appendChild(profileTag);
  } else {
    let profileName = document.createElement("h1");
    profileName.textContent = "Aucun photographe sous cet id";
    profileName.setAttribute(
      "aria-label",
      "Message d'erreur : Aucun photographe sous cet"
    );
    textPhotographer.appendChild(profileName);
    console.log("Aucun photographe n'est accessible sur cet id");
  }
}
