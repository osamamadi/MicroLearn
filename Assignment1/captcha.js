// --- Global Variables ---
let correctArithmeticAnswer = 0;
let correctImageKeyword = "";
let correctImageIndexes = new Set();
let selectedIndexes = new Set();
let captchaType = "arithmetic";
let maxAttempts = 3;
let failedAttempts = 0;

// --- Elements ---
const arithmeticContainer = document.getElementById("arithmetic-captcha-container");
const imageContainer = document.getElementById("image-captcha-container");
const captchaTypeSelector = document.getElementById("captcha-type");
const arithmeticChallenge = document.getElementById("arithmetic-challenge");
const arithmeticAnswer = document.getElementById("arithmetic-answer");
const imageOptions = document.getElementById("image-options");
const imageChallengeText = document.getElementById("image-challenge-text");

const imageData = [
  // 🐶 Dogs
  { src: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Golde33443.jpg", label: "dog" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/3/37/Liver_yellow_dog_in_the_water_looking_at_viewer_at_golden_hour_in_Don_Det_Laos.jpg", label: "dog" },

  // 🐱 Cats
  { src: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg", label: "cat" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Domestic_cat_2019_G1.jpg", label: "cat" },

  // 🚗 Cars
  { src: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Fiat_500_in_Emilia-Romagna.jpg", label: "car" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/7/79/DTM_Mercedes_W204_Lauda09_amk.jpg", label: "car" },

  // 🚲 Bikes
  { src: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Dutch_bicycle.jpg", label: "bike" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/3/30/Bicycle%2C_belonging_to_the_bicycle-sharing_system_Bolt_in_Kaunas%2C_Lithuania_in_2022.jpg", label: "bike" }
];

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}



// --- CAPTCHA Generation Functions ---
function generateArithmeticCaptcha() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  correctArithmeticAnswer = a + b;
  arithmeticChallenge.textContent = `${a} + ${b} = ?`;
  arithmeticAnswer.value = "";
}

function generateImageCaptcha() {
  imageOptions.innerHTML = "";
  correctImageIndexes.clear();
  selectedIndexes.clear();

  // Choose a random keyword (like "dog", "cat", etc.)
  const keywords = [...new Set(imageData.map((img) => img.label))];
  correctImageKeyword = keywords[Math.floor(Math.random() * keywords.length)];
  imageChallengeText.textContent = correctImageKeyword;

  // Shuffle the imageData
  const shuffledData = shuffleArray([...imageData]);

  shuffledData.forEach((img, index) => {
    const imgElement = document.createElement("img");
    imgElement.src = img.src;
    imgElement.className = "captcha-image-option object-cover";
    imgElement.dataset.index = index;

    if (img.label === correctImageKeyword) {
      correctImageIndexes.add(index.toString());
    }

    imgElement.addEventListener("click", () => {
      const idx = imgElement.dataset.index;
      if (selectedIndexes.has(idx)) {
        selectedIndexes.delete(idx);
        imgElement.classList.remove("selected");
      } else {
        selectedIndexes.add(idx);
        imgElement.classList.add("selected");
      }
    });

    imageOptions.appendChild(imgElement);
  });
}


// --- Event Listeners ---
captchaTypeSelector.addEventListener("change", (e) => {
  captchaType = e.target.value;
  if (captchaType === "arithmetic") {
    arithmeticContainer.classList.remove("hidden");
    imageContainer.classList.add("hidden");
    generateArithmeticCaptcha();
  } else {
    imageContainer.classList.remove("hidden");
    arithmeticContainer.classList.add("hidden");
    generateImageCaptcha();
  }
});

document.getElementById("refresh-arithmetic-captcha").addEventListener("click", generateArithmeticCaptcha);
document.getElementById("refresh-image-captcha").addEventListener("click", generateImageCaptcha);

// --- Initial CAPTCHA Load ---
generateArithmeticCaptcha();

// --- Form Submission ---
document.getElementById("register-form").addEventListener("submit", function (e) {
  // Hide all errors
  document.getElementById("arithmetic-error").classList.add("hidden");
  document.getElementById("image-error").classList.add("hidden");
  document.getElementById("captcha-attempts-error")?.classList?.add("hidden");

  // CAPTCHA validation
  let captchaValid = false;

  if (captchaType === "arithmetic") {
    if (parseInt(arithmeticAnswer.value) === correctArithmeticAnswer) {
      captchaValid = true;
    } else {
      document.getElementById("arithmetic-error").classList.remove("hidden");
    }
  } else {
    if (
      selectedIndexes.size === correctImageIndexes.size &&
      [...selectedIndexes].every((i) => correctImageIndexes.has(i))
    ) {
      captchaValid = true;
    } else {
      document.getElementById("image-error").classList.remove("hidden");
    }
  }

  if (!captchaValid) {
    e.preventDefault();
    e.stopImmediatePropagation();

    failedAttempts++;
    if (failedAttempts >= maxAttempts) {
      document.getElementById("captcha-attempts-error").classList.remove("hidden");
      this.querySelector("button[type=submit]").disabled = true;
    }
  }
});
