const user = JSON.parse(localStorage.getItem("microlearn_user"));
console.log("user", user);

document.getElementById("search-count").textContent = user.searches;
document.getElementById("video-count").textContent = user.videosWatched;
document.getElementById("quiz-count").textContent = user.quizzesCompleted;
document.getElementById("nav-user-name").textContent = user.name;
document.getElementById("profile-name").textContent = user.name;
document.getElementById("profile-email").textContent = user.email;
showRecentSearches()
showRecentVideos();
// Profile dropdown toggle
const profileDropdown = document.getElementById("profile-dropdown");
const dropdownMenu = document.getElementById("dropdown-menu");

if (profileDropdown && dropdownMenu) {
  profileDropdown.addEventListener("click", function () {
    dropdownMenu.classList.toggle("hidden");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", function (event) {
    if (!profileDropdown.contains(event.target)) {
      dropdownMenu.classList.add("hidden");
    }
  });
}
// Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
    
    function handleLogout() {
        localStorage.removeItem('microlearn_user');
        window.location.href = 'index.html';
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener('click', handleLogout);
    }

function showRecentSearches() {
  const user = JSON.parse(localStorage.getItem("microlearn_user"));
  if (!user) return;

  const history = JSON.parse(localStorage.getItem(`search_history_${user.id}`) || '[]');
  const container = document.getElementById("search-history");

  // 🧠 Create a map by term, keeping the newest timestamp
  const uniqueMap = new Map();
  history.forEach(item => {
    if (!uniqueMap.has(item.term)) {
      uniqueMap.set(item.term, item);
    }
  });

  // 🔁 Convert to array, sort by timestamp descending
  const sorted = [...uniqueMap.values()].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const last5 = sorted.slice(0, 5);

  if (last5.length === 0) {
    container.innerHTML += `<p class="text-gray-500">No recent searches</p>`;
    return;
  }

  const list = document.createElement("ul");
  list.className = "list-disc list-inside text-gray-700 space-y-1";

  last5.forEach(search => {
    const li = document.createElement("li");
    li.textContent = search.term;
    list.appendChild(li);
  });

  container.appendChild(list);
}


function showRecentVideos() {
  const user = JSON.parse(localStorage.getItem("microlearn_user"));
  if (!user) return;

  const history = JSON.parse(localStorage.getItem(`video_history_${user.id}`) || '[]');
  const container = document.getElementById("video-history");

  // 🧠 Create a map by videoId, keeping the newest timestamp
  const uniqueMap = new Map();
  history.forEach(item => {
    if (!uniqueMap.has(item.videoId)) {
      uniqueMap.set(item.videoId, item);
    }
  });

  // 🔁 Convert to array, sort by timestamp descending
  const sorted = [...uniqueMap.values()].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const last5 = sorted.slice(0, 5);

  if (last5.length === 0) {
    container.innerHTML += `<p class="text-gray-500">No videos watched</p>`;
    return;
  }

  const list = document.createElement("ul");
  list.className = "list-disc list-inside text-gray-700 space-y-1";

  last5.forEach(video => {
    const li = document.createElement("li");
    li.innerHTML = `
      <button onclick="openSimpleVideoModal('${video.videoId}', \`${video.title}\`)" class="text-indigo-600 hover:underline">
        ${video.title}
      </button>
    `;
    list.appendChild(li);
  });

  container.appendChild(list);
}

function incrementUserQuizCount() {
  const user = JSON.parse(localStorage.getItem('microlearn_user'));
  if (!user) return;

  user.quizzesCompleted = (user.quizzesCompleted || 0) + 1;
  localStorage.setItem('microlearn_user', JSON.stringify(user));
}

function MakeQuiz() {
  //Add 1 to the profile counter
  incrementUserQuizCount();
  const searchValue = document.getElementById("search-input").value;
  localStorage.setItem("topic", searchValue);
}

function openSimpleVideoModal(videoId, title) {
  const modal = document.getElementById("simple-video-modal");
  const iframe = document.getElementById("simple-video-iframe");
  const titleEl = document.getElementById("simple-video-title");

  titleEl.textContent = title;
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  modal.classList.remove("hidden");
}

function closeSimpleVideoModal() {
  const modal = document.getElementById("simple-video-modal");
  const iframe = document.getElementById("simple-video-iframe");

  iframe.src = ""; // Stop the video
  modal.classList.add("hidden");
}
//okrh