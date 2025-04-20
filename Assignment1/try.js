// Try Search page JavaScript

document.addEventListener("DOMContentLoaded", function () {
  trackDiv = document.getElementById("Track");
  const user = JSON.parse(localStorage.getItem("microlearn_user"));
  if (user) {
    trackDiv.classList.add("hidden");
  }
  // Mobile menu toggle
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // Search form submission
  const searchForm = document.getElementById("try-search-form");
  const searchInput = document.getElementById("search-input");

  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const searchTerm = searchInput.value.trim();

      if (!searchTerm) {
        showNotification("Please enter a search term", "error");
        return;
      }

      performSearch(searchTerm);
    });
  }

  // Search suggestion buttons
  const searchSuggestions = document.querySelectorAll(".search-suggestion");

  if (searchSuggestions) {
    searchSuggestions.forEach((button) => {
      button.addEventListener("click", function () {
        const term = this.textContent.trim();
        searchInput.value = term;
        performSearch(term);
      });
    });
  }

  // Try again button
  const tryAgainBtn = document.getElementById("try-again-btn");

  if (tryAgainBtn) {
    tryAgainBtn.addEventListener("click", function () {
      // Hide results and show initial state
      document.getElementById("results-section").classList.add("hidden");
      document.getElementById("no-results").classList.add("hidden");
      document.getElementById("initial-section").classList.remove("hidden");

      // Focus on search input
      searchInput.value = "";
      searchInput.focus();
    });
  }

  // Video modal close button
  const closeModalBtn = document.getElementById("close-modal");
  const videoModal = document.getElementById("video-modal");

  if (closeModalBtn && videoModal) {
    closeModalBtn.addEventListener("click", function () {
      closeVideoModal();
    });

    // Close modal when clicking outside
    videoModal.addEventListener("click", function (event) {
      if (event.target === videoModal) {
        closeVideoModal();
      }
    });

    // Close modal with escape key
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !videoModal.classList.contains("hidden")) {
        closeVideoModal();
      }
    });
  }

  // Check for search parameter in URL
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get("q");

  if (searchQuery) {
    searchInput.value = searchQuery;
    performSearch(searchQuery);
  }
});

// Perform search
function performSearch(searchTerm) {
  // Show loading state
  document.getElementById("initial-section").classList.add("hidden");
  document.getElementById("results-section").classList.add("hidden");
  document.getElementById("loading-section").classList.remove("hidden");

  // Simulate API call delay (would be a real YouTube API call in production)
  setTimeout(() => {
    // Hide loading state
    document.getElementById("loading-section").classList.add("hidden");
    document.getElementById("results-section").classList.remove("hidden");

    // Update topic title
    document.getElementById("topic-title").textContent = searchTerm;

    // Generate topic summary
    const summary = generateTopicSummary(searchTerm);
    document.getElementById("topic-summary").innerHTML = summary;

    // Generate video results
    const videos = generateVideoResults(searchTerm);
    const videoResultsContainer = document.getElementById("video-results");

    if (videoResultsContainer) {
      if (videos.length === 0) {
        document.getElementById("no-results").classList.remove("hidden");
        videoResultsContainer.innerHTML = "";
      } else {
        document.getElementById("no-results").classList.add("hidden");
        videoResultsContainer.innerHTML = "";

        videos.forEach((video) => {
          const videoCard = document.createElement("div");
          videoCard.className =
            "video-card transform hover:-translate-y-1 transition-all";
          videoCard.innerHTML = `
                        <div class="video-thumbnail">
                            <img src="${video.thumbnail}" alt="${video.title}" class="rounded-t-xl">
                            <span class="video-duration">${video.duration}</span>
                            <div class="video-play-button">
                                <i class="fas fa-play"></i>
                            </div>
                        </div>
                        <div class="p-4 bg-white rounded-b-xl">
                            <h3 class="font-medium mb-2 line-clamp-2 text-lg" title="${video.title}">${video.title}</h3>
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-500">${video.views} views</span>
                                <span class="text-sm text-gray-500 flex items-center">
                                    <i class="fas fa-clock mr-1 text-orange-500"></i>
                                    ${video.duration}
                                </span>
                            </div>
                        </div>
                    `;

          videoResultsContainer.appendChild(videoCard);

          // Add click event to play video
          videoCard.addEventListener("click", function () {
            openVideoModal(video);
          });
        });
      }
    }
  }, 1500);
}

function openVideoModal(videoId) {
  const videoModal = document.getElementById('video-modal');
  const videoContainer = document.getElementById('video-container');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  
  if (!videoModal || !videoContainer) return;
  
  // Find video data
  const video = findVideoById(videoId);
  console.log("Video found:", video);
  
  if (!video) {
      showNotification('Video not found', 'error');
      return;
  }

  // Update modal content
  modalTitle.textContent = video.title;
  modalDescription.textContent = video.description;

  // Set a fixed height via JS (so iframe has height to fill)
  videoContainer.style.position = 'relative';
  videoContainer.style.width = '100%';
  videoContainer.style.height = '400px'; // You can change height if needed
  console.log(videoId);
  // Create iframe for YouTube video
  videoContainer.innerHTML = `
      <iframe 
          src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen
          style="position:absolute; top:0; left:0; width:100%; height:100%;"
      ></iframe>
  `;

  // Show modal
  videoModal.classList.remove('hidden');

  // Save to history
  saveVideoToHistory(video);
}


// Close video modal
function closeVideoModal() {
  const videoModal = document.getElementById('video-modal');
  const videoContainer = document.getElementById('video-container');
  
  if (!videoModal || !videoContainer) return;
  
  // Clear video container
  videoContainer.innerHTML = '';
  
  // Hide modal
  videoModal.classList.add('hidden');
}

// Find video by ID
function findVideoById(videoId) {
  // This would normally come from an API
  // For demo purposes, we'll use our mock video data
  const allVideos = [];
  
  // Add videos for all topics
  const topics = ['Quantum Physics', 'Machine Learning', 'Data Structures', 'Software Development'];
  
  topics.forEach(topic => {
      allVideos.push(...generateVideoResults(topic));
  });
  
  return allVideos.find(video => video.id === videoId);
}

// Generate topic summary
function generateTopicSummary(topic) {
  // This would normally come from an API like ChatGPT or a knowledge base
  // For demo purposes, we'll use mock data
  const summaries = {
    "Data Structures": `
            <p>Data structures are specialized formats for organizing, processing, retrieving and storing data. They provide efficient ways to access and modify information, crucial for algorithm design and software development.</p>
            <p>Common data structures include arrays, linked lists, stacks, queues, trees, graphs, and hash tables. Each has specific use cases, advantages, and limitations regarding time complexity and memory usage.</p>
        `,
    "Quantum Physics": `
            <p>Quantum physics is a branch of physics that explores the behavior of matter and energy at the smallest scales. Unlike classical physics, quantum mechanics reveals that particles can exist in multiple states simultaneously (superposition) and can be connected across vast distances (entanglement).</p>
            <p>Key concepts include wave-particle duality, Heisenberg's uncertainty principle, and quantum field theory. These principles have led to technologies like lasers, transistors, and are fundamental to developing quantum computers.</p>
        `,
    "Machine Learning": `
            <p>Machine learning is a branch of artificial intelligence that focuses on developing systems that can learn from and make decisions based on data. Instead of being explicitly programmed to perform a task, these systems use algorithms and statistical models to analyze patterns in data and make predictions or decisions.</p>
            <p>Key approaches include supervised learning (training with labeled data), unsupervised learning (finding patterns in unlabeled data), and reinforcement learning (learning through trial and error with rewards). Applications range from image recognition and natural language processing to recommendation systems and autonomous vehicles.</p>
        `,
    "World War II": `
            <p>World War II (1939-1945) was a global conflict that pitted the Allies (including the United States, Great Britain, and the Soviet Union) against the Axis powers (Nazi Germany, Italy, and Japan).</p>
            <p>The war began with Germany's invasion of Poland and expanded across Europe, Africa, Asia, and the Pacific. Key events included the Holocaust, D-Day, the Battle of Stalingrad, and the atomic bombings of Hiroshima and Nagasaki. The conflict resulted in an estimated 70-85 million casualties and reshaped the political and social landscape of the 20th century.</p>
        `,
  };

  // Return summary for the topic, or a generic one if not found
  return (
    summaries[topic] ||
    `
        <p>${topic} is a fascinating subject with many aspects to explore. The videos below provide concise, focused explanations to help you understand the key concepts quickly and effectively.</p>
        <p>Each video is under 6 minutes long, making them perfect for efficient learning. After watching, you can test your knowledge with our mini-quizzes to reinforce what you've learned.</p>
    `
  );
}

// Generate video results
function generateVideoResults(topic) {
  // This would normally come from the YouTube API with a duration filter
  // For demo purposes, we'll use mock data
  const videoData = {
    "Data Structures": [
      {
        id: "ds-1",
        title: "Data Structures Explained in 5 Minutes",
        description:
          "A quick overview of the most important data structures every programmer should know, including arrays, linked lists, stacks, queues, trees, and hash tables.",
        thumbnail: "https://img.youtube.com/vi/DuDz6B4cqVc/hqdefault.jpg",
        duration: "5:12",
        views: "1.8M",
      },
      {
        id: "ds-2",
        title: "Arrays vs. Linked Lists: Which to Use When?",
        description:
          "This video compares arrays and linked lists, explaining their strengths, weaknesses, and the best use cases for each data structure.",
        thumbnail: "https://img.youtube.com/vi/lC-yYCOnN8Q/hqdefault.jpg",
        duration: "4:45",
        views: "956K",
      },
      {
        id: "ds-3",
        title: "Hash Tables in 6 Minutes",
        description:
          "Learn how hash tables work, why they provide O(1) average time complexity for lookups, and how to handle collisions.",
        thumbnail: "https://img.youtube.com/vi/MfhjkfocRR0/hqdefault.jpg",
        duration: "5:58",
        views: "1.2M",
      },
      {
        id: "ds-4",
        title: "Binary Trees and Binary Search Trees Explained",
        description:
          "A clear explanation of tree data structures, focusing on binary trees and binary search trees, with examples of common operations.",
        thumbnail: "https://img.youtube.com/vi/fAAZixBzIAI/hqdefault.jpg",
        duration: "5:24",
        views: "784K",
      },
    ],
    "Quantum Physics": [
      {
        id: "qp-1",
        title: "Quantum Physics Explained in 6 Minutes",
        description:
          "A concise explanation of the fundamental principles of quantum physics, including superposition, entanglement, and wave-particle duality.",
        thumbnail: "https://img.youtube.com/vi/7ku5PIU2dGY/hqdefault.jpg",
        duration: "5:42",
        views: "1.2M",
      },
      {
        id: "qp-2",
        title: "Understanding Schrödinger's Equation",
        description:
          "This video breaks down the famous Schrödinger equation and explains its importance in quantum mechanics.",
        thumbnail: "https://img.youtube.com/vi/jvvkomcmyuo/hqdefault.jpg",
        duration: "4:18",
        views: "856K",
      },
      {
        id: "qp-3",
        title: "Quantum Entanglement Simplified",
        description:
          'Learn about quantum entanglement, Einstein\'s "spooky action at a distance," and why it matters for quantum computing.',
        thumbnail: "https://img.youtube.com/vi/1zD1U1sIPQ4/hqdefault.jpg",
        duration: "5:55",
        views: "643K",
      },
    ],
    "Machine Learning": [
      {
        id: "ml-1",
        title: "Machine Learning Basics in 6 Minutes",
        description:
          "An introduction to the fundamental concepts of machine learning, including supervised and unsupervised learning.",
        thumbnail: "https://img.youtube.com/vi/ukzFI9rgwfU/hqdefault.jpg",
        duration: "5:58",
        views: "1.7M",
      },
      {
        id: "ml-2",
        title: "Neural Networks Explained Simply",
        description:
          "Learn how artificial neural networks work, from single neurons to deep learning architectures.",
        thumbnail: "https://img.youtube.com/vi/aircAruvnKk/hqdefault.jpg",
        duration: "4:44",
        views: "2.2M",
      },
      {
        id: "ml-3",
        title: "Reinforcement Learning: How Machines Learn to Play Games",
        description:
          "This video explains how reinforcement learning works and how it's used to teach AI to master complex games.",
        thumbnail: "https://img.youtube.com/vi/JgvyzIkgxF0/hqdefault.jpg",
        duration: "5:36",
        views: "965K",
      },
    ],
    "World War II": [
      {
        id: "ww2-1",
        title: "World War II: Causes in 5 Minutes",
        description:
          "A brief overview of the key factors that led to the outbreak of World War II in Europe and the Pacific.",
        thumbnail: "https://img.youtube.com/vi/fo2Rb9h788s/hqdefault.jpg",
        duration: "5:12",
        views: "2.4M",
      },
      {
        id: "ww2-2",
        title: "D-Day Explained: The Normandy Landings",
        description:
          "Learn about Operation Overlord, the Allied invasion of Normandy on June 6, 1944, a turning point in World War II.",
        thumbnail: "https://img.youtube.com/vi/PgN6QO5nsJk/hqdefault.jpg",
        duration: "5:48",
        views: "1.8M",
      },
      {
        id: "ww2-3",
        title: "The Pacific Theater: Japan's Role in WWII",
        description:
          "This video covers Japan's expansion in Asia, Pearl Harbor, and the major battles in the Pacific during World War II.",
        thumbnail: "https://img.youtube.com/vi/7tNTh6KlXXU/hqdefault.jpg",
        duration: "5:36",
        views: "976K",
      },
    ],
  };

  // Return videos for the topic, or an empty array if not found
  return videoData[topic] || [];
}

// Notification function
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
    type === "success"
      ? "bg-green-500"
      : type === "error"
        ? "bg-red-500"
        : "bg-blue-500"
  } text-white`;

  notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${
              type === "success"
                ? "fa-check-circle"
                : type === "error"
                  ? "fa-exclamation-circle"
                  : "fa-info-circle"
            } mr-2"></i>
            <span>${message}</span>
        </div>
    `;

  // Add to DOM
  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateY(-20px)";
    notification.style.transition = "opacity 0.5s ease, transform 0.5s ease";

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 500);
  }, 3000);
}
