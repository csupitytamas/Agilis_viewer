const fetch = require('node-fetch');

const presentationId = 1;

async function checkCurrentSlide() {
  const response = await fetch(`http://localhost:3000/${presentationId}/current`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  const data = await response.json();
  console.log(`Current slide: ${data.slide}, Running: ${data.running}`);
}

setInterval(checkCurrentSlide, 3000);