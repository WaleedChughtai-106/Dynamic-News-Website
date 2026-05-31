const API_KEY = "ece1a2489c8dfdb48f1bc6fe06438f0f";
const BASE_URL = "https://gnews.io/api/v4";

const CATEGORY_MAP = {
  general: "general",
  finance: "business",
  sports: "sports",
};

export default async function handler(req, res) {
  const { category, q } = req.query;

  let url;
  if (q) {
    url = `${BASE_URL}/search?q=${encodeURIComponent(q)}&lang=en&sortby=publishedAt&max=10&token=${API_KEY}`;
  } else {
    const gCategory = CATEGORY_MAP[category] || "general";
    url = `${BASE_URL}/top-headlines?category=${gCategory}&lang=en&max=10&token=${API_KEY}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
}
