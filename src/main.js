// API request options
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-cg-demo-api-key": "CG-mDVVqLm5xBDjvcVq523LnAmB",
  },
};

// state variables
let coins = [];
let currentPage = 1;
let itemsPerPage = 25;
const fetchCoins = async (page = currentPage) => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_
     desc&per_page=${itemsPerPage}&page=${page}`,
      options
    );
    coins = await response.json();
  } catch (err) {
    console.error(err);
  }
  return coins;
};

const getFavorites = () => JSON.parse(localStorage.getItem("favorites")) || [];

const renderCoinsRow = (coin, index, start, favorite) => {
  const isFavorite = favorite.includes(coin.id);
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${start + index}</td>
    <td><img src="${coin.image}" alt="${
    coin.name
  }" width="24px" height="24px"/></td>
    <td>${coin.name}</td>
    <td>${coin.current_price.toLocaleString()}</td>
    <td>${coin.total_volume.toLocaleString()}</td>
    <td>${coin.market_cap.toLocaleString()}</td>
    <td>
      <i class="fa-solid fa-star ${isFavorite ? "favorite" : ""}" data-id="${
    coin.id
  }"></i>
    </td>
  `;
  return row;
};

const renderCoins = (coinsToDisplay, page, itemsPerPage) => {
  const start = (page - 1) * itemsPerPage + 1;
  const favorites = getFavorites();
  const tableBody = document.querySelector("#coins-table-body");
  if (!tableBody) {
    console.error("Table body not found");
    return;
  }
  tableBody.innerHTML = "";
  coinsToDisplay.forEach((coin, index) => {
    const row = renderCoinsRow(coin, index, start, favorites);
    tableBody.appendChild(row);
  });
};

const initializePage = async () => {
  const coins = await fetchCoins(currentPage);
  if (coins.length === 0) {
    console.error("No coins data fetched");
    return;
  }
  renderCoins(coins, currentPage, itemsPerPage);
};

document.addEventListener("DOMContentLoaded", initializePage);
