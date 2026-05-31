const PLACEHOLDER_IMG = "assets/images/placeholder.png";

const newsContainer = document.getElementById("news-container");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

// Fetch by category (Home, Finance, Sports, etc)
async function fetchNews(category = "general") {
  const url = `/api/news?category=${category}`;
  await renderNews(url);
}

// Search by query
async function searchNews(query) {
  const url = `/api/news?q=${encodeURIComponent(query)}`;
  await renderNews(url);
}

// Render News
async function renderNews(url) {
  newsContainer.innerHTML = `<div class="loading-spinner"><div class="spinner"></div><p>Loading news...</p></div>`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    newsContainer.innerHTML = "";

    if (!data.articles || data.articles.length === 0) {
      newsContainer.innerHTML = "<p>No news found.</p>";
      return;
    }

    // GNews returns article.image
    data.articles.forEach((article) => {
      const card = document.createElement("div");
      card.classList.add("news-card");

      card.innerHTML = `
        <img src="${article.image || PLACEHOLDER_IMG}" alt="News Image" onerror="this.src='${PLACEHOLDER_IMG}'">
        <h2>${article.title}</h2>
        <p>${article.description || "No description available."}</p>
        <a href="${article.url}" target="_blank" rel="noopener noreferrer">Read more</a>
      `;
      newsContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    newsContainer.innerHTML = "<p>Error loading news. Try again later.</p>";
  }
}

// Navigation logic (nav + footer quick links)
document.querySelectorAll("[data-category]").forEach((link) => {
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

// Search bar logic
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

// Default load (Home)
fetchNews("general");

// Dynamic copyright year
document.querySelector(".footer-bottom p").innerHTML =
  `&copy; ${new Date().getFullYear()} WC News. All Rights Reserved.`;
