const pageName = window.location.pathname.split("/").pop().split(".")[0];
const fileTypes = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const maxBanners = 5;

const bannerElement = document.getElementById("hero-banner");
const prevButton = document.getElementById("prev-banner");
const nextButton = document.getElementById("next-banner");

let bannerImages = [];
let currentBannerIndex = 0;
let loadedCount = 0;
let totalToTry = fileTypes.length * maxBanners;
let rotationInterval = null;
let manualPauseTimeout = null;

// Load banner images for current page
function preloadBannerImages() {
  for (let i = 1; i <= maxBanners; i++) {
    fileTypes.forEach((ext) => {
      const path = `images/${pageName}-banner${i}${ext}`;
      const img = new Image();
      img.src = path;
      img.onload = () => {
        bannerImages.push(path);
        checkStartRotation();
      };
      img.onerror = checkStartRotation;
    });
  }
}

// Called after each image check
function checkStartRotation() {
  loadedCount++;
  if (loadedCount === totalToTry) {
    if (bannerImages.length > 0) {
      updateBanner();
      startRotation();
    } else {
      bannerElement.src = "images/fallback.jpg";
    }
  }
}

// Set the current banner image
function updateBanner() {
  if (bannerImages.length > 0) {
    bannerElement.src = bannerImages[currentBannerIndex];
  }
}

// Move to previous banner
function showPrevBanner() {
  currentBannerIndex = (currentBannerIndex - 1 + bannerImages.length) % bannerImages.length;
  updateBanner();
  pauseRotationTemporarily();
}

// Move to next banner
function showNextBanner() {
  currentBannerIndex = (currentBannerIndex + 1) % bannerImages.length;
  updateBanner();
  pauseRotationTemporarily();
}

// Start automatic rotation
function startRotation() {
  if (rotationInterval) clearInterval(rotationInterval);
  rotationInterval = setInterval(showNextBanner, 6000);
}

// Pause rotation after manual click
function pauseRotationTemporarily() {
  clearInterval(rotationInterval);
  clearTimeout(manualPauseTimeout);
  manualPauseTimeout = setTimeout(startRotation, 10000); // Pause for 10 seconds
}

// Pause rotation on hover
function setupHoverPause() {
  if (!bannerElement) return;
  bannerElement.addEventListener("mouseenter", () => clearInterval(rotationInterval));
  bannerElement.addEventListener("mouseleave", startRotation);
}

// Event listeners
if (prevButton) prevButton.addEventListener("click", showPrevBanner);
if (nextButton) nextButton.addEventListener("click", showNextBanner);

// Initialize
if (bannerElement) {
  preloadBannerImages();
  setupHoverPause();
}
