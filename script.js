const API_KEY = "20ba1478466f4c16b9a6f82b6ac8e45a";
const baseUrl = "https://newsapi.org/v2";

const newsContainer = document.getElementById("news-container");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

// Fetch by category (Home, Finance, Sports, etc)
async function fetchNews(category = "general") {
  let url = `${baseUrl}/top-headlines?country=pk&apiKey=${API_KEY}`;

  if (category === "finance") {
    url += `&category=business`;
  } else if (category !== "general") {
    url += `&category=${category}`;
  }

  await renderNews(url, category);
}

// Search by query
async function searchNews(query) {
  let url = `${baseUrl}/everything?q=${query}&language=en&sortBy=publishedAt&apiKey=${API_KEY}`;
  await renderNews(url);
}

//Render News
async function renderNews(url, category = null) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    newsContainer.innerHTML = "";

    //If no news found, fallback to global
    if (!data.articles || data.articles.length === 0) {
      console.warn("No local news, loading global...");

      if (category) {
        // Fallback global by language
        let fallbackUrl = `${baseUrl}/top-headlines?language=en&apiKey=${API_KEY}`;
        if (category === "finance") {
          fallbackUrl += `&category=business`;
        } else if (category !== "general") {
          fallbackUrl += `&category=${category}`;
        }
        return renderNews(fallbackUrl);
      }

      newsContainer.innerHTML = "<p>No news found.</p>";
      return;
    }

    //Render NewsCards
    data.articles.forEach((article) => {
      const card = document.createElement("div");
      card.classList.add("news-card");

      card.innerHTML = `
        <img src="${article.urlToImage || ""}" alt="News Image">
        <h2>${article.title}</h2>
        <p>${article.description || "No description available."}</p>
        <a href="${article.url}" target="_blank">Read more</a>
      `;
      newsContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    newsContainer.innerHTML = "<p>Error loading news. Try again later.</p>";
  }
}
//Navigations logic
document.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const category = e.target.getAttribute("data-category");

    if (category === "politics") {
      searchNews("politics");
    } else {
      fetchNews(category);
    }
  });
});

//Search Bar logic
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) searchNews(query);
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (query) searchNews(query);
  }
});

//Default load(Home)
fetchNews("general");
