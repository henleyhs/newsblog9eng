const params = new URLSearchParams(window.location.search);
const articleId = params.get("id");

let textSize = 16;

// LOAD ARTICLES (HOME PAGE)
if (document.getElementById("articlesGrid")) {
  fetch("articles.json")
    .then(res => res.json())
    .then(data => {
      const grid = document.getElementById("articlesGrid");

      data.forEach(article => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <img src="${article.image}">
          <h3>${article.title}</h3>
        `;
        card.onclick = () => {
          window.location.href = `article.html?id=${article.id}`;
        };
        grid.appendChild(card);
      });
    });
}

// LOAD ARTICLE PAGE
if (articleId) {
  fetch("articles.json")
    .then(res => res.json())
    .then(data => {
      const article = data.find(a => a.id == articleId);

      document.getElementById("title").innerText = article.title;
      document.getElementById("content").innerHTML = article.content;

      // Chart
      if (article.chart) {
        new Chart(document.getElementById("chart"), {
          type: "bar",
          data: {
            labels: article.chart.labels,
            datasets: [{
              label: "Data",
              data: article.chart.data
            }]
          }
        });
      }
    });
}

// TEXT SIZE CONTROL
function changeTextSize(change) {
  textSize += change;
  document.getElementById("content").style.fontSize = textSize + "px";
}