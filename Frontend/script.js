let chartInstance;

function addMessage(text, sender) {
  const box = document.getElementById("chatBox");
  const msg = document.createElement("div");
  msg.className = chat-message ${sender};
  msg.textContent = text;
  box.appendChild(msg);
  box.scrollTop = box.scrollHeight;
}

async function handleMessage() {
  const input = document.getElementById("userInput");
  const query = input.value.trim();
  if (!query) return;

  addMessage(query, "user");

  input.value = "";
  addMessage("Analyzing market data...", "bot");

  const response = await fetch('https://your-backend-url.onrender.com/predict', {
    method: 'POST'
  });

  const data = await response.json();
  const stock = query.toUpperCase();
  const prediction = data[stock];

  if (prediction) {
    addMessage( Predicted next price of ${stock}: $${prediction.toFixed(2)}, "bot");
    updateGraph(data);
  } else {
    addMessage(No data available for "${stock}", "bot");
  }
}

function updateGraph(data) {
  const labels = Object.keys(data);
  const values = Object.values(data);

  const ctx = document.getElementById('graph').getContext('2d');

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: "Predicted Prices",
        data: values,
        backgroundColor: labels.map((_, i) => ['blue', 'green', 'red'][i % 3]),
        borderRadius: 10
      }]
    },
    options: {
      animation: {
        duration: 800,
        easing: "easeInOutQuart"
      },
      scales: {
        y: { ticks: { color: "white" } },
        x: { ticks: { color: "white" } }
      },
      plugins: {
        legend: {
          labels: {
            color: "white"
          }
        }
      }
    }
  });
}