let storiesData = {}; // Store story data
let currentIndex = 0;
let autoplayInterval;

// Get story name from URL
const urlParams = new URLSearchParams(window.location.search);
const storyName = urlParams.get("story");

// Fetch stories.json
fetch("stories.json")
  .then((response) => response.json())
  .then((data) => {
    storiesData = data;
    if (storyName && storiesData[storyName]) {
      loadStory(storyName);
    } else {
      showHomePage();
    }
  })
  .catch((error) => {
    document.getElementById("content").innerHTML =
      "<h2>Error loading stories.</h2>";
  });

// Show available stories on home page
function showHomePage() {
  let homeContent = "<h2>Available Stories</h2><ul>";
  Object.keys(storiesData).forEach((story) => {
    homeContent += `<li><a href="?story=${story}">${storiesData[story].title}</a></li>`;
  });
  homeContent += "</ul>";
  document.getElementById("home").innerHTML = homeContent;
}

// Load selected story
function loadStory(story) {
  document.title = storiesData[story].title;
  document.getElementById("story-title").textContent = storiesData[story].title;
  document.getElementById("story-link").href =
    "stories/" + story + "/README.md";

  // Hide home and show story
  document.getElementById("home").style.display = "none";
  document.getElementById("story-container").style.display = "block";

  initializeStory(storiesData[story].images);
}

// Initialize story
function initializeStory(images) {
  const storyImage = document.getElementById("story-image");
  const thumbnailsDiv = document.getElementById("thumbnails");
  thumbnailsDiv.innerHTML = ""; // Clear old thumbnails

  // Generate thumbnails
  images.forEach((img, index) => {
    const thumb = document.createElement("img");
    thumb.src = `stories/${storyName}/${img}`;
    thumb.classList.add("thumbnail");
    thumb.onclick = () => showImage(index);
    thumbnailsDiv.appendChild(thumb);
  });

  function showImage(index) {
    currentIndex = (index + images.length) % images.length;
    storyImage.src = `stories/${storyName}/${images[currentIndex]}`;

    // Ensure image scales properly without horizontal scrolling
    storyImage.style.maxWidth = "100%"; // Fit within screen width
    storyImage.style.maxHeight = window.innerHeight * 0.7 + "px"; // Limit height
    // Highlight active thumbnail
    document.querySelectorAll(".thumbnail").forEach((thumb, i) => {
      thumb.classList.toggle("active", i === currentIndex);
    });
  }

  window.nextImage = () => showImage(currentIndex + 1);
  window.prevImage = () => showImage(currentIndex - 1);

  // Autoplay function
  function startAutoplay() {
    autoplayInterval = setInterval(() => nextImage(), 3000);
    document.getElementById("autoplay-btn").textContent = "⏸ Pause";
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
    document.getElementById("autoplay-btn").textContent = "▶ Play";
  }

  window.toggleAutoplay = () => {
    if (autoplayInterval) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  };

  showImage(0); // Show first image
}
