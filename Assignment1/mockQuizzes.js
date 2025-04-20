//Get the index from the local Storage

let Quiz; // Now accessible in all functions

function getRandomIndex() {
  return Math.floor(Math.random() * 3);
}

function checkAnswer() {
  const correctIndex = Quiz.correctIndex; // Accesses dynamically loaded correct index
  const selected = document.querySelector('input[name="q1"]:checked');

  if (!selected) {
    alert("Please select an answer.");
    return;
  }

  if (parseInt(selected.value) === correctIndex) {
    alert("✅ Correct!");
  } else {
    alert("❌ Incorrect.");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const QuizTopic = localStorage.getItem("topic");
  Quiz = mockQuizzes[QuizTopic][getRandomIndex()]; // assign to the global `Quiz`

  document.getElementById("question-text").textContent = Quiz.question;
  document.getElementById("option-0-text").textContent = Quiz.options[0];
  document.getElementById("option-1-text").textContent = Quiz.options[1];
  document.getElementById("option-2-text").textContent = Quiz.options[2];
  document.getElementById("option-3-text").textContent = Quiz.options[3];
});


const mockQuizzes = {
    'Quantum Physics': [
        {
            question: "What is a quantum particle's wave function used for?",
            options: [
                "To determine its mass",
                "To describe its probability distribution",
                "To measure time",
                "To find its charge"
            ],
            correctIndex: 1
        },
        {
            question: "What happens during the collapse of a wave function?",
            options: [
                "The particle's position becomes uncertain",
                "The particle is destroyed",
                "The particle takes on a definite state",
                "The particle turns into energy"
            ],
            correctIndex: 2
        },
        {
            question: "Which experiment demonstrated the wave-particle duality of light?",
            options: [
                "Photoelectric effect",
                "Double-slit experiment",
                "Heisenberg experiment",
                "Entanglement test"
            ],
            correctIndex: 1
        }
    ],
    'Machine Learning': [
        {
            question: "Which algorithm is best suited for classification tasks?",
            options: [
                "Linear regression",
                "K-means clustering",
                "Decision tree",
                "Principal component analysis"
            ],
            correctIndex: 2
        },
        {
            question: "Which term describes the difference between predicted and actual values?",
            options: [
                "Accuracy",
                "Loss",
                "Precision",
                "Recall"
            ],
            correctIndex: 1
        },
        {
            question: "What does overfitting mean in machine learning?",
            options: [
                "The model performs well on both training and test data",
                "The model is too simple for the data",
                "The model captures noise instead of the pattern",
                "The model uses too little data"
            ],
            correctIndex: 2
        }
    ],
    'Data Structures': [
        {
            question: "Which data structure uses LIFO (Last In First Out)?",
            options: [
                "Queue",
                "Stack",
                "Linked List",
                "Tree"
            ],
            correctIndex: 1
        },
        {
            question: "What is the time complexity of binary search on a sorted array?",
            options: [
                "O(n)",
                "O(log n)",
                "O(n log n)",
                "O(1)"
            ],
            correctIndex: 1
        },
        {
            question: "Which data structure is best for implementing a priority queue?",
            options: [
                "Array",
                "Stack",
                "Heap",
                "Linked List"
            ],
            correctIndex: 2
        }
    ],
    'Software Development': [
        {
            question: "What is the purpose of version control systems like Git?",
            options: [
                "To compile code",
                "To manage file permissions",
                "To track and manage changes in code",
                "To design UI components"
            ],
            correctIndex: 2
        },
        {
            question: "Which development methodology emphasizes short iterations and continuous feedback?",
            options: [
                "Waterfall",
                "Agile",
                "DevOps",
                "RAD"
            ],
            correctIndex: 1
        },
        {
            question: "In object-oriented programming, what does 'encapsulation' mean?",
            options: [
                "Using one method to serve multiple purposes",
                "Combining multiple classes",
                "Restricting access to some of the object's components",
                "Inheriting methods from another class"
            ],
            correctIndex: 2
        }
    ]
};

// Export for use in other files
if (typeof module !== 'undefined') {
    module.exports = mockQuizzes;
}
