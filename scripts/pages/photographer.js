//Mettre le code JavaScript lié à la page photographer.html
const url = "/data/photographers.json";

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

  