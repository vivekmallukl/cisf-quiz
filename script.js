// REPLACE THIS URL with your deployed Google Apps Script Web App URL
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxAcA4oFuMNis4S8tzUgPjIeRMD5FmokfkCxsJmQXmgun-1XJ767zOEvZ1x2eQFT2iD/exec";

const searchBtn = document.getElementById('searchBtn');
const cisfInput = document.getElementById('cisfInput');
const profileDetails = document.getElementById('profileDetails');
const errorMsg = document.getElementById('errorMsg');
const loader = document.getElementById('loader');

searchBtn.addEventListener('click', performSearch);
cisfInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') performSearch();
});

async function performSearch() {
  const query = cisfInput.value.trim();
  if (!query) return;

  // Reset UI elements
  errorMsg.style.display = 'none';
  profileDetails.style.display = 'none';
  loader.style.display = 'block';

  try {
    // Call our Google Sheet Script and pass the CISF number in the URL
    const response = await fetch(`${WEB_APP_URL}?cisf=${encodeURIComponent(query)}`);
    const result = await response.json();

    loader.style.display = 'none';

    if (result.status === "success") {
      displayProfile(result.data);
    } else {
      showError(result.message);
    }
  } catch (error) {
    loader.style.display = 'none';
    showError("Could not connect to the database. Please check your Script URL.");
    console.error(error);
  }
}

function displayProfile(data) {
  // Clear old info
  profileDetails.innerHTML = '';
  
  // Dynamically map every header/column from Google Sheets into the website UI
  for (const [key, value] of Object.entries(data)) {
    const row = document.createElement('div');
    row.className = 'info-row';
    row.innerHTML = `
      <span class="label">${key}:</span>
      <span class="value">${value || 'N/A'}</span>
    `;
    profileDetails.appendChild(row);
  }
  
  profileDetails.style.display = 'block';
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.style.display = 'block';
}
