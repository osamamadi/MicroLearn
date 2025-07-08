// api/explanation/route.js
import { URL } from "url";
// Handles GET requests to generate explanation, summary, quiz, and category using Gemini API

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  // Return empty response if no query is provided

  if (!query) {
    return new Response(
      JSON.stringify({ explanation: "", summary: "", quiz: [] }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  // Gemini API configuration

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    // --- Step 1: Generate the Full Explanation ---
    const explanationResponse = await fetch(geminiApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Provide a clear, concise explanation of: ${query}. Keep it educational and under 200 words, suitable for someone learning about this topic for the first time.`,
              },
            ],
          },
        ],
        generationConfig: { temperature: 0.2, maxOutputTokens: 300 },
      }),
    });

    const explanationData = await explanationResponse.json();
    const explanation =
      explanationData.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No explanation available.";

    // --- Step 2: Generate a Summary based on the Full Explanation ---
    let summary = "";
    if (explanation !== "No explanation available.") {
      const summaryPrompt = `Summarize the following explanation into a concise paragraph of 1-2  sentences. Focus on the core concepts only, and do NOT use bullet points or any special characters for formatting.

Explanation:
${explanation}`;

      const summaryResponse = await fetch(geminiApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: summaryPrompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 150 }, // Adjust maxOutputTokens for summary length
        }),
      });

      const summaryData = await summaryResponse.json();
      summary =
        summaryData.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No summary available.";
    }

    // Step 0: Determine the Category using Gemini
    let category = "Other";
    const categoryPrompt = `Classify the following topic into one of these categories:
Machine Learning,DevOps, Math, History, Artificial Intelligence, Programming, Data Structures & Algorithms, Health, Cloud Computing, Cybersecurity, Sports, Politics, Web Development, Art & Design, Other.

Return ONLY the category name (nothing else).

Query:
${query}`;

    try {
      const categoryResponse = await fetch(geminiApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: categoryPrompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 30 },
        }),
      });

      const categoryData = await categoryResponse.json();
      category =
        categoryData.candidates?.[0]?.content?.parts?.[0]?.text.trim() ||
        "Other";
      // Validate category against allowed list

      const allowedCategories = [
        "Math",
        "History",
        "Sports",
        "Other",
        "Politics",
        "Art & Design",
        "Health",
        "Machine Learning",
        "Artificial Intelligence",
        "Programming",
        "Data Structures & Algorithms",
        "Cloud Computing",
        "Cybersecurity",
        "DevOps",
        "Web Development",
      ];
      if (!allowedCategories.includes(category)) {
        category = "Other";
      }
    } catch (err) {
      console.error("Gemini category classification error:", err);
      category = "Other";
    }

    // --- Step 3: Generate Four Quiz Questions based on the Explanation ---
    let quiz = [];
    if (explanation !== "No explanation available.") {
      const quizPrompt = `Based on the following explanation, create four multiple-choice quiz questions. Each question should have 4 options, and you must indicate the correct option's index (0-indexed). The response must be a JSON array of objects, with each object having the following exact structure:
          [
            {
              "question": "Your first question here",
              "options": [
                "Option 1",
                "Option 2",
                "Option 3",
                "Option 4"
              ],
              "correctIndex": 0
            },
            {
              "question": "Your second question here",
              "options": [
                "Option A",
                "Option B",
                "Option C",
                "Option D"
              ],
              "correctIndex": 2
            },
            {
              "question": "Your third question here",
              "options": [
                "Choice X",
                "Choice Y",
                "Choice Z",
                "Choice W"
              ],
              "correctIndex": 3
            },
            {
              "question": "Your fourth question here",
              "options": [
                "Item Alpha",
                "Item Beta",
                "Item Gamma",
                "Item Delta"
              ],
              "correctIndex": 1
            }
          ]

          Explanation:
          ${explanation}
          `;

      const quizResponse = await fetch(geminiApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: quizPrompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 600 },
        }),
      });

      const quizData = await quizResponse.json();

      try {
        const quizText = quizData.candidates?.[0]?.content?.parts?.[0]?.text;
        // Try to extract and parse JSON quiz data

        if (quizText) {
          const jsonMatch = quizText.match(/```json\n([\s\S]*?)\n```/);
          if (jsonMatch && jsonMatch[1]) {
            quiz = JSON.parse(jsonMatch[1]);
          } else if (
            quizText.trim().startsWith("[") &&
            quizText.trim().endsWith("]")
          ) {
            quiz = JSON.parse(quizText);
          } else {
            quiz = [];
          }
        }
      } catch (parseError) {
        console.error(
          "Error parsing quiz JSON from Gemini response:",
          parseError
        );
        quiz = [];
      }
    }

    // --- Send the Explanation, Summary, and Quiz to the Frontend ---
    return new Response(
      JSON.stringify({ explanation, summary, quiz, category }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Gemini API request failed:", error);
    return new Response(
      JSON.stringify({
        explanation: "Error fetching data.",
        summary: "",
        quiz: [],
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
