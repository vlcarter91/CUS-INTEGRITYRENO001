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

// Attempt to preload up to 5 images of any common type
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

// Called after each load attempt to decide what to do
function checkStartRotation() {
  loadedCount++;

  if (loadedCount === totalToTry) {
    if (bannerImages.length > 0) {
      updateBanner();
      startRotation();
    } else {
      // No banners found, use fallback
      bannerElement.src = "images/fallback.jpg";
    }
  }
}

// Update the banner image
function updateBanner() {
  if (bannerImages.length > 0) {
    bannerElement.src = bannerImages[currentBannerIndex];
  }
}

// Show previous
function showPrevBanner() {
  currentBannerIndex = (currentBannerIndex - 1 + bannerImages.length) % bannerImages.length;
  updateBanner();
}

// Show next
function showNextBanner() {
  currentBannerIndex = (currentBannerIndex + 1) % bannerImages.length;
  updateBanner();
}

// Start auto-rotation
function startRotation() {
  setInterval(showNextBanner, 6000);
}

// Add button listeners
if (prevButton) prevButton.addEventListener("click", showPrevBanner);
if (nextButton) nextButton.addEventListener("click", showNextBanner);

// Start loading
if (bannerElement) preloadBannerImages();
