function photographerTemplate(data) {
  const { id, name, portrait, city, country, tagline, price } = data;

  const picture = `assets/photographers/${portrait}`;
  const profileLink = `photographer.html?id=${id}`;

  function getUserCardDOM() {
    const article = document.createElement("article");
    article.setAttribute("role", "article");
    article.setAttribute("aria-label", `Profil de ${name}`);

    const img = document.createElement("img");
    img.setAttribute("src", picture);
    img.setAttribute("alt", `Portrait de ${name}`);

    const link = document.createElement("a");
    link.setAttribute("href", profileLink);
    link.setAttribute("aria-label", `Nom : ${name} `);

    const h2 = document.createElement("h2");
    h2.textContent = name;

    const h3 = document.createElement("h3");
    h3.textContent = `${city},${country}`;

    h3.setAttribute("aria-label", `Localisation: ${city},${country}`);

    const h4 = document.createElement("h4");
    h4.textContent = tagline;
    h4.setAttribute("aria-label", `Citation : ${tagline}`);

    const p = document.createElement("p");
    p.textContent = `${price}€/jour`;
    p.setAttribute("aria-label", `Prix : ${price} euros par jour`);
    link.appendChild(img)
    link.appendChild(h2);
    article.appendChild(link);
    article.appendChild(h3);
    article.appendChild(h4);
    article.appendChild(p);
    return article;
  }
  return { name, picture, getUserCardDOM };
}
