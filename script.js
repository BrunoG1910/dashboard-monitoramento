const chartCtx = document.getElementById("tempChart").getContext("2d");

let tempChart = new Chart(chartCtx, {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      label: "Temperatura (°C)",
      data: [],
      borderColor: "rgba(75, 192, 192, 1)",
      tension: 0.2
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: false
      }
    }
  }
});

async function fetchData() {
  const url = "https://us-east-1-1.aws.cloud2.influxdata.com/api/v2/query?org=d6ee1907ac9ce624";
  const token = "QIPgFhMaGAaFPbFtg758pJcwiNKbUfB_iZvMJ4u-WohDBDnevO3QOu5MyymSXf6UnuhZ4q8i7ojWw4rkdTyXGA==";
  const query = `from(bucket: "monitoramento-temp") |> range(start: -1h) |> filter(fn: (r) => r._measurement == "temperatura")`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/vnd.flux"
    },
    body: query
  });

  const rawText = await res.text();
  const linhas = rawText.split("\n").filter(l => l.includes("_time"));
  const labels = linhas.map(l => l.split(",")[6].split("T")[1].split("Z")[0]);
  const dados = linhas.map(l => parseFloat(l.split(",")[7]));

  tempChart.data.labels = labels;
  tempChart.data.datasets[0].data = dados;
  tempChart.update();
}