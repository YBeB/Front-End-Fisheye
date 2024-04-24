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
  const textPhotographer = document.querySelector(".text-profil")
  const photographer = photographers.find((p) => p.id.toString() === id);
  if (photographer ) {
    let profilePicture = document.createElement("img");
    profilePicture.src = `./assets/photographers/${photographer.portrait}`;
    profilePicture.classList.add("profilePicture");
    let profileName = document.createElement("h1");
    profileName.textContent = photographer.name;
    let profileTag = document.createElement("p");
    profileTag.textContent = photographer.tagline;
    let profilCity=document.createElement('h2')
    profilCity.textContent=`${photographer.city},${photographer.country}`

    photographerHeader.appendChild(profilePicture);
    textPhotographer.appendChild(profileName);
    textPhotographer.appendChild(profilCity);
    textPhotographer.appendChild(profileTag);
    

  }else{
    let profileName = document.createElement("h1");
    profileName.textContent = "Aucun photographe sous cet id";
    textPhotographer.appendChild(profileName);
console.log("Aucun photographe n'est accessible sur cet id")

  }

  
}
displayPhotographer()

