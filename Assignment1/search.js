// Search page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const userData = localStorage.getItem('microlearn_user');
    
    if (!userData) {
        // Redirect to login if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    const user = JSON.parse(userData);
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Profile dropdown toggle
    const profileDropdown = document.getElementById('profile-dropdown');
    const dropdownMenu = document.getElementById('dropdown-menu');
    
    if (profileDropdown && dropdownMenu) {
        profileDropdown.addEventListener('click', function() {
            dropdownMenu.classList.toggle('hidden');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!profileDropdown.contains(event.target)) {
                dropdownMenu.classList.add('hidden');
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
    


    // Update user information
    const navUserName = document.getElementById('nav-user-name');
    const navProfileImg = document.getElementById('nav-profile-img');
    
    if (navUserName) navUserName.textContent = user.name;
        //hai msh zabta
    if (navProfileImg) navProfileImg.src = user.profileImage;
    
    // Load recent searches
    loadRecentSearches();
    
    // Search form submission
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const searchTerm = searchInput.value.trim();
            
            if (!searchTerm) {
                showNotification('Please enter a search term', 'error');
                return;
            }
            
            performSearch(searchTerm);
        });
    }
    
    // Popular topics click handlers
    const popularTopics = document.getElementById('popular-topics');
    
    if (popularTopics) {
        const topicButtons = popularTopics.querySelectorAll('button');
        
        topicButtons.forEach(button => {
            button.addEventListener('click', function() {
                const topic = this.textContent.trim();
                searchInput.value = topic;
                performSearch(topic);
            });
        });
    }
    
    // Check for search parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');
    const videoId = urlParams.get('video');
    
    if (searchQuery) {
        searchInput.value = searchQuery;
        performSearch(searchQuery);
    } else if (videoId) {
        // Load video directly
        openVideoModal(videoId);
    }
    
    // Video modal close button
    const closeModalBtn = document.getElementById('close-modal');
    const videoModal = document.getElementById('video-modal');
    
    if (closeModalBtn && videoModal) {
        closeModalBtn.addEventListener('click', function() {
            closeVideoModal();
        });
        
        // Close modal when clicking outside
        videoModal.addEventListener('click', function(event) {
            if (event.target === videoModal) {
                closeVideoModal();
            }
        });
        
        // Close modal with escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && !videoModal.classList.contains('hidden')) {
                closeVideoModal();
            }
        });
    }
    
    // Take quiz button
    const takeQuizBtn = document.getElementById('take-quiz-btn');
    
    if (takeQuizBtn) {
        takeQuizBtn.addEventListener('click', function() {
            // Close modal
            closeVideoModal();
            
            // Redirect to profile page with quiz parameter
            window.location.href = 'profile.html#quiz';
        });
    }
});

// Load recent searches
function loadRecentSearches() {
    const user = JSON.parse(localStorage.getItem('microlearn_user'));
    
    if (!user) return;
    
    const searchHistory = JSON.parse(localStorage.getItem(`search_history_${user.id}`) || '[]');
    const recentSearchesContainer = document.getElementById('recent-searches');
    
    if (recentSearchesContainer) {
        if (searchHistory.length === 0) {
            recentSearchesContainer.innerHTML = `
                <p class="text-gray-500">No recent searches</p>
            `;
            return;
        }
        
        recentSearchesContainer.innerHTML = '';
        
        // Display only the last 5 unique searches
        const uniqueSearches = [...new Map(searchHistory.map(item => [item.term, item])).values()];
        const recentSearches = uniqueSearches.slice(0, 5);
        
        recentSearches.forEach(search => {
            const searchTag = document.createElement('button');
            searchTag.className = 'px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-800 transition-colors flex items-center';
            searchTag.innerHTML = `
                <i class="fas fa-history text-gray-500 mr-2 text-xs"></i>
                ${search.term}
            `;
            
            searchTag.addEventListener('click', function() {
                document.getElementById('search-input').value = search.term;
                performSearch(search.term);
            });
            
            recentSearchesContainer.appendChild(searchTag);
        });
    }
}

function incrementUserSearchCount() {
    const user = JSON.parse(localStorage.getItem('microlearn_user'));
    if (!user) return;

    user.searches = (user.searches || 0) + 1;
    localStorage.setItem('microlearn_user', JSON.stringify(user));
}

// Perform search
function performSearch(searchTerm) {
    // Show loading state
    document.getElementById('initial-section').classList.add('hidden');
    document.getElementById('results-section').classList.add('hidden');
    document.getElementById('loading-section').classList.remove('hidden');
    
    // Save search to history
    saveSearch(searchTerm);
    incrementUserSearchCount();
    // Simulate API call delay
    setTimeout(() => {
        // Hide loading state
        document.getElementById('loading-section').classList.add('hidden');
        document.getElementById('results-section').classList.remove('hidden');
        
        // Update topic title
        document.getElementById('topic-title').textContent = searchTerm;
        
        // Generate topic summary
        const summary = generateTopicSummary(searchTerm);
        document.getElementById('topic-summary').innerHTML = summary;
        
        // Generate video results
        const videos = generateVideoResults(searchTerm);
        
        const videoResultsContainer = document.getElementById('video-results');
        
        if (videoResultsContainer) {
            if (videos.length === 0) {
                document.getElementById('no-results').classList.remove('hidden');
                videoResultsContainer.innerHTML = '';
            } else {
                document.getElementById('no-results').classList.add('hidden');
                videoResultsContainer.innerHTML = '';
                
                videos.forEach(video => {
                    const videoCard = document.createElement('div');
                    videoCard.className = 'video-card';
                    videoCard.innerHTML = `
                        <div class="video-thumbnail">
                            <img src="${video.thumbnail}" alt="${video.title}">
                            <span class="video-duration">${video.duration}</span>
                            <div class="video-play-button">
                                <i class="fas fa-play"></i>
                            </div>
                        </div>
                        <div class="p-4">
                            <h3 class="font-medium mb-2 line-clamp-2" title="${video.title}">${video.title}</h3>
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-500">${video.views} views</span>
                                <button class="text-sm text-indigo-600 hover:text-indigo-800 save-video-btn">
                                    <i class="far fa-bookmark"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    
                    videoResultsContainer.appendChild(videoCard);                    
                    // Add click event to play video
                    videoCard.addEventListener('click', function() {
                        openVideoModal(video.id);
                        saveVideoToHistory(video);
                    });
                });
            }
        }
    }, 1500);
}

// Save search to history
function saveSearch(searchTerm) {
    const user = JSON.parse(localStorage.getItem('microlearn_user'));
    if (!user) return;
  
    const key = `search_history_${user.id}`;
    let history = JSON.parse(localStorage.getItem(key) || '[]');
  
    // 🧽 Remove old entry if it exists
    history = history.filter(item => item.term !== searchTerm);
  
    // 🆕 Add new entry with updated timestamp
    history.unshift({
      term: searchTerm,
      timestamp: new Date().toISOString()
    });
  
    // ✂️ Limit to 20
    const trimmed = history.slice(0, 20);
    localStorage.setItem(key, JSON.stringify(trimmed));
  }
  

  function saveVideoToHistory(video) {
    const user = JSON.parse(localStorage.getItem('microlearn_user'));
    if (!user) return;
  
    const key = `video_history_${user.id}`;
    let history = JSON.parse(localStorage.getItem(key) || '[]');
  
    // 🧽 Remove old video if it exists
    const wasAlreadyWatched = history.some(v => v.videoId === video.id);
    history = history.filter(v => v.videoId !== video.id);
  
    // 🆕 Add updated video info with new timestamp
    history.unshift({
      videoId: video.id,
      title: video.title,
      thumbnail: video.thumbnail,
      duration: video.duration,
      timestamp: new Date().toISOString()
    });
  
    // ✂️ Limit to 20
    const trimmed = history.slice(0, 20);
    localStorage.setItem(key, JSON.stringify(trimmed));
  
    // ✅ Only increment if it was a new video
    if (!wasAlreadyWatched) {
      user.videosWatched = (user.videosWatched || 0) + 1;
      localStorage.setItem('microlearn_user', JSON.stringify(user));
    }
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
    // This would normally come from an API
    // For demo purposes, we'll use mock data
    const summaries = {
        'Quantum Physics': `
            <p>Quantum physics is a branch of physics that explores the behavior of matter and energy at the smallest scales. Unlike classical physics, quantum mechanics reveals that particles can exist in multiple states simultaneously (superposition) and can be connected across vast distances (entanglement).</p>
            <p>Key concepts include wave-particle duality, Heisenberg's uncertainty principle, and quantum field theory. These principles have led to technologies like lasers, transistors, and are fundamental to developing quantum computers.</p>
        `,
        'Machine Learning': `
            <p>Machine learning is a branch of artificial intelligence that focuses on developing systems that can learn from and make decisions based on data. Instead of being explicitly programmed to perform a task, these systems use algorithms and statistical models to analyze patterns in data and make predictions or decisions.</p>
            <p>Key approaches include supervised learning (training with labeled data), unsupervised learning (finding patterns in unlabeled data), and reinforcement learning (learning through trial and error with rewards). Applications range from image recognition and natural language processing to recommendation systems and autonomous vehicles.</p>
        `,
        'Data Structures': `
            <p>Data structures are essential concepts in computer science that involve organizing, storing, and retrieving data efficiently. Common data structures include arrays, linked lists, stacks, queues, trees, graphs, and hash tables.</p>
            <p>Choosing the appropriate data structure is crucial for algorithm performance, as it impacts time complexity and memory usage. Understanding these structures is fundamental for developing efficient algorithms and solving complex computational problems.</p>
        `,
        'Software Development': `
            <p>Software development is the process of designing, coding, testing, and maintaining software applications. It involves using programming languages, frameworks, and development tools to create solutions that meet user needs.</p>
            <p>Key methodologies in software development include Agile, Scrum, and DevOps, which emphasize collaboration, continuous improvement, and iterative development. Understanding best practices in software design, testing, and debugging is crucial for building high-quality software.</p>
        `
    };

    // Return summary for the topic, or a generic one if not found
    return summaries[topic] || `
        <p>${topic} is a fascinating subject with many aspects to explore. The videos below provide concise, focused explanations to help you understand the key concepts quickly and effectively.</p>
        <p>Each video is under 6 minutes long, making them perfect for efficient learning. After watching, you can test your knowledge with our mini-quizzes to reinforce what you've learned.</p>
    `;
}



// Generate video results
// Generate video results
function generateVideoResults(topic) {
    // This would normally come from an API (e.g., YouTube)
    // For demo purposes, we'll use mock data
    const videoData = {
        'Quantum Physics': [
            {
                id: 'eWra029qFcY',
                title: 'Quantum Entanglement in 5 Minutes',
                description: 'Dive into the intriguing world of quantum mechanics and unravel the mysteries of entanglement and superposition.',
                thumbnail: 'https://img.youtube.com/vi/eWra029qFcY/hqdefault.jpg',
                duration: '5:00',
                views: '1.1M'
            },
            {
                id: 'lstXHHlLrKo',
                title: 'Understanding Schrödinger\'s Equation',
                description: 'This video breaks down the famous Schrödinger equation and explains its importance in quantum mechanics.',
                thumbnail: 'https://img.youtube.com/vi/aircAruvnKk/hqdefault.jpg',
                duration: '4:44',
                views: '856K'
            },
            {
                id: 'GahNjwrbWAY',
                title: 'Quantum Entanglement Simplified',
                description: 'Learn about quantum entanglement, Einstein\'s "spooky action at a distance," and why it matters for quantum computing.',
                thumbnail: 'https://img.youtube.com/vi/1zD1U1sIPQ4/hqdefault.jpg',
                duration: '5:55',
                views: '643K'
            }
        ],
        'Machine Learning': [
            {
                id: 'yN7ypxC7838',
                title: 'Machine Learning Basics in 6 Minutes',
                description: 'An introduction to the fundamental concepts of machine learning, including supervised and unsupervised learning.',
                thumbnail: 'https://img.youtube.com/vi/ukzFI9rgwfU/hqdefault.jpg',
                duration: '5:58',
                views: '1.7M'
            },
            {
                id: '7gbGavTLUUE',
                title: 'Neural Networks Explained Simply',
                description: 'Learn how artificial neural networks work, from single neurons to deep learning architectures.',
                thumbnail: 'https://img.youtube.com/vi/aircAruvnKk/hqdefault.jpg',
                duration: '4:44',
                views: '2.2M'
            },
            {
                id: '3bJ7RChxMWQ',
                title: 'Reinforcement Learning: How Machines Learn to Play Games',
                description: 'This video explains how reinforcement learning works and how it\'s used to teach AI to master complex games.',
                thumbnail: 'https://img.youtube.com/vi/JgvyzIkgxF0/hqdefault.jpg',
                duration: '5:36',
                views: '965K'
            }
        ],
        'Data Structures': [
            {
                "id": "ayW5B2W9hfo",
                "title": "Union Find in 5 minutes — Data Structures & Algorithms",
                "description": "A concise explanation of the Union Find algorithm, an essential concept in data structures used for managing disjoint sets.",
                "thumbnail": "https://img.youtube.com/vi/ayW5B2W9hfo/hqdefault.jpg",
                "duration": "5:00",
                "views": "1.5M"
              },
              {
                "id": "_T42E9RkWVQ",
                "title": "DATA STRUCTURES Explained in 5 minutes! (for beginners)",
                "description": "A concise introduction to fundamental data structures like arrays, linked lists, stacks, and queues, designed for beginners.",
                "thumbnail": "https://img.youtube.com/vi/_T42E9RkWVQ/hqdefault.jpg",
                "duration": "5:00",
                "views": "1.2M"
              },
              {
                "id": "T9DSBhBR_I4",
                "title": "Types of Data Structures",
                "description": "An introduction to various data structures, explaining their types and applications in computer science.",
                "thumbnail": "https://img.youtube.com/vi/T9DSBhBR_I4/hqdefault.jpg",
                "duration": "5:00",
                "views": "1.3M"
              }
              
        ],
        'Software Development': [
            {
                "id": "bBbP5MFdvwY",
                "title": "SOFTWARE DEVELOPMENT METHODOLOGIES in 5 minutes!",
                "description": "A concise overview of various software development methodologies, including Agile, Waterfall, and Scrum, designed to help beginners understand the different approaches to software development.",
                "thumbnail": "https://img.youtube.com/vi/bBbP5MFdvwY/hqdefault.jpg",
                "duration": "5:00",
                "views": "1.1M"
              },
              {
                "id": "Fi3_BjVzpqk",
                "title": "Introduction To Software Development LifeCycle | What Is Software Development? | Simplilearn",
                "description": "This video provides an overview of the Software Development Life Cycle (SDLC), explaining its phases and importance in delivering high-quality software products.",
                "thumbnail": "https://img.youtube.com/vi/Fi3_BjVzpqk/hqdefault.jpg",
                "duration": "5:00",
                "views": "1.2M"
              }
              ,
              {
                "id": "rIQcP4zEB2k",
                "title": "The Complete Software Development Process Explained (In Under 5 Mins)",
                "description": "A concise overview of the software development lifecycle, covering key stages from planning to deployment, designed for beginners and professionals alike.",
                "thumbnail": "https://img.youtube.com/vi/rIQcP4zEB2k/hqdefault.jpg",
                "duration": "4:57",
                "views": "1.2M"
              }
        ]
    };

    // Return videos for the topic, or an empty array if not found
    return videoData[topic] || [];
}


// Notification function
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    } text-white`;
    
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' : 
                type === 'error' ? 'fa-exclamation-circle' : 
                'fa-info-circle'
            } mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        notification.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}


