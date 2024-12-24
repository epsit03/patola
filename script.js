const GEMINI_API_KEY = "AIzaSyCZlSs61yMB9gWIWcEmVO1He9lVB0T9KBk"; // Replace with your actual API key
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const preferencesForm = document.getElementById("preferencesForm");
const recommendationsAccordion = document.getElementById("recommendationsAccordion");
const makeupHacksSection = document.getElementById("makeupHacks");

// Handle form submission
preferencesForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Get user preferences
  const skinType = document.getElementById("skinType").value;
  const occasion = document.getElementById("occasion").value;

  if (!skinType || !occasion) {
    alert("Please select both skin type and occasion.");
    return;
  }

  // Create prompts
  const recommendationsPrompt = `Provide foundation recommendations for ${skinType} skin suitable for a ${occasion}.`;
  const makeupHacksPrompt = `Provide detailed makeup hacks for ${skinType} skin suitable for a ${occasion}.`;

  // Fetch data from the API
  const [recommendationsResponse, makeupHacksResponse] = await Promise.all([
    fetchFromGeminiAPI(recommendationsPrompt),
    fetchFromGeminiAPI(makeupHacksPrompt),
  ]);

  if (recommendationsResponse) {
    renderDynamicSections(recommendationsResponse, recommendationsAccordion, "recommendations");
  }

  if (makeupHacksResponse) {
    renderDynamicSections(makeupHacksResponse, makeupHacksSection, "makeupHacks");
  }
});

// Fetch data from the Gemini API
async function fetchFromGeminiAPI(prompt) {
  try {
    const payload = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Failed to fetch data from Gemini API.");

    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("Error fetching data. Please try again.");
    return null;
  }
}

// Render content dynamically
function renderDynamicSections(response, container, type) {
  const text = response.candidates[0]?.content.parts[0]?.text || "";
  const sections = extractSections(text);

  renderAccordion(sections, container, type);
}

// Extract sections based on headers
function extractSections(text) {
  const lines = text.split("\n");
  const sections = {};
  let currentHeader = null;

  lines.forEach((line) => {
    if (line.startsWith("**")) {
      currentHeader = line.replace(/\*\*/g, "").trim();
      sections[currentHeader] = [];
    } else if (currentHeader && line.trim()) {
      sections[currentHeader].push(line.trim());
    }
  });

  return sections;
}

// Render accordion dynamically
function renderAccordion(sections, container, type) {
  container.innerHTML = "";

  Object.entries(sections).forEach(([header, content]) => {
    const formattedContent = content
      .map((line) => {
        if (line.startsWith("*")) {
          return `<li>${line.slice(1).trim()}</li>`;
        }
        return `<p>${line}</p>`;
      })
      .join("");

    const html = `
      <div class="accordion-item">
        <h2 class="accordion-header" id="${type}-${header.replace(/\s+/g, "")}Heading">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${type}-${header.replace(/\s+/g, "")}" aria-expanded="false">
            ${header}
          </button>
        </h2>
        <div id="${type}-${header.replace(/\s+/g, "")}" class="accordion-collapse collapse" data-bs-parent="#${type}">
          <div class="accordion-body">
            <ul>${formattedContent}</ul>
          </div>
        </div>
      </div>
    `;

    container.innerHTML += html;
  });
}

// Select the mouse background element
const mouseBackground = document.getElementById('mouse-background');
const preferencesForm = document.getElementById('preferencesForm');
const loadingSpinner = document.getElementById('loadingSpinner');
const recommendationsAccordion = document.getElementById('recommendationsAccordion');

// Add event listener for mouse movement
document.addEventListener('mousemove', (event) => {
  const mouseX = event.clientX;
  const mouseY = event.clientY;
  
  // Update the position of the background element to follow the mouse
  mouseBackground.style.left = `${mouseX - mouseBackground.offsetWidth / 2}px`; // Center the background on the cursor
  mouseBackground.style.top = `${mouseY - mouseBackground.offsetHeight / 2}px`;  // Center the background on the cursor
  
  // Make sure the background has a smooth scaling and movement
  mouseBackground.style.transform = `scale(1.5)`; // Scale the background when the mouse moves
});

// Reset the background scale when mouse stops moving
let timer;
document.addEventListener('mousemove', () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    mouseBackground.style.transform = `scale(1)`; // Reset to normal scale
  }, 100);
});

// Handle the form submission
preferencesForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // Show the loading spinner and hide recommendations
  loadingSpinner.style.display = 'block';
  recommendationsAccordion.style.display = 'none';

  // Simulate an API call to fetch recommendations (this will be replaced by real data in a real app)
  setTimeout(() => {
    // Simulate recommendations loading
    loadingSpinner.style.display = 'none';
    recommendationsAccordion.style.display = 'block';

    // Add dummy recommendations to the accordion
    recommendationsAccordion.innerHTML = `
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingOne">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
            Recommended Products for Oily Skin
          </button>
        </h2>
        <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#recommendationsAccordion">
          <div class="accordion-body">
            - Product 1: Oil-free foundation<br>
            - Product 2: Mattifying primer<br>
            - Product 3: Powder blush
          </div>
        </div>
      </div>
    `;
  }, 2000); // Simulate 2-second delay for the loading effect
});
