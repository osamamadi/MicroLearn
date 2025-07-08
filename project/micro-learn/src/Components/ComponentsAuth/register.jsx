// components/SignupComponent.jsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import CaptchaSection from "./captcha";

const imageData = [
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Golde33443.jpg",
    label: "dog",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/3/37/Liver_yellow_dog_in_the_water_looking_at_viewer_at_golden_hour_in_Don_Det_Laos.jpg",
    label: "dog",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg",
    label: "cat",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Domestic_cat_2019_G1.jpg",
    label: "cat",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Fiat_500_in_Emilia-Romagna.jpg",
    label: "car",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/7/79/DTM_Mercedes_W204_Lauda09_amk.jpg",
    label: "car",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Dutch_bicycle.jpg",
    label: "bike",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/3/30/Bicycle%2C_belonging_to_the_bicycle-sharing_system_Bolt_in_Kaunas%2C_Lithuania_in_2022.jpg",
    label: "bike",
  },
];

// Simple shuffle utility to randomize image options

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
// SignupComponent handles user registration with CAPTCHA verification

const SignupComponent = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirm: "",
    email: "",
  });
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle
  const [message, setMessage] = useState(""); // Success or error message
  const [captchaType, setCaptchaType] = useState("arithmetic"); // "arithmetic" or "image"

  // Arithmetic CAPTCHA state
  const [challenge, setChallenge] = useState("");
  const [answer, setAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(null);
  // Image CAPTCHA state

  const [imageOptions, setImageOptions] = useState([]);
  const [correctLabel, setCorrectLabel] = useState("");
  const [selectedIndexes, setSelectedIndexes] = useState(new Set());
  const [correctIndexes, setCorrectIndexes] = useState(new Set());

  const [error, setError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const maxAttempts = 3; // Max allowed incorrect CAPTCHA attempts
  // Handles switching CAPTCHA type and resets state

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handles switching CAPTCHA type and resets state
  const handleCaptchaChange = (e) => {
    setCaptchaType(e.target.value);
    setFailedAttempts(0);
    setError("");
  };

  // Generates a simple math CAPTCHA (e.g., 3 + 7)
  const generateArithmetic = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setChallenge(`${a} + ${b} = ?`);
    setCorrectAnswer(a + b);
    setAnswer("");
  };
  // Generates image CAPTCHA by selecting a target label

  const generateImageCaptcha = () => {
    const shuffled = shuffle([...imageData]);
    const keywords = [...new Set(imageData.map((img) => img.label))];
    const chosenLabel = keywords[Math.floor(Math.random() * keywords.length)];

    const newCorrectIndexes = new Set();
    shuffled.forEach((img, idx) => {
      if (img.label === chosenLabel) newCorrectIndexes.add(idx.toString());
    });

    setImageOptions(shuffled);
    setCorrectLabel(chosenLabel);
    setCorrectIndexes(newCorrectIndexes);
    setSelectedIndexes(new Set());
  };
  // Toggles image selection (add/remove)

  const toggleSelect = (idx) => {
    const newSet = new Set(selectedIndexes);
    newSet.has(idx) ? newSet.delete(idx) : newSet.add(idx);
    setSelectedIndexes(newSet);
  };

  const validateCaptcha = () => {
    return captchaType === "arithmetic"
      ? parseInt(answer) === correctAnswer
      : selectedIndexes.size === correctIndexes.size &&
          [...selectedIndexes].every((idx) => correctIndexes.has(idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // CAPTCHA check before proceeding
    if (!validateCaptcha()) {
      setFailedAttempts((prev) => prev + 1);
      setError("❌ CAPTCHA failed. Try again.");
      if (failedAttempts + 1 >= maxAttempts)
        setError("❌ Too many incorrect CAPTCHA attempts. Try later.");
      return;
    }

    form.username = form.username.toLowerCase();

    // Submit form to register API
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.username,
        password: form.password,
        email: form.email,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("✅ Signup successful!");
      setForm({ username: "", password: "", confirm: "", email: "" });
    } else {
      setMessage(`❌ ${data.error}`);
    }
  };

  // Trigger CAPTCHA generation on load or change
  useEffect(() => {
    captchaType === "arithmetic"
      ? generateArithmetic()
      : generateImageCaptcha();
  }, [captchaType]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Create Your Account
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-300 mb-6">
          Join MicroLearn and start learning today
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" />
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="your name"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
              <span
                className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
              Password must be at least 8 characters long
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />
          </div>

          {/* CAPTCHA TYPE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Choose CAPTCHA Type:
            </label>
            <select
              value={captchaType}
              onChange={handleCaptchaChange}
              className="w-full px-3 py-2 border rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="arithmetic">Arithmetic</option>
              <option value="image">Image Selection</option>
            </select>
          </div>

          {/* CAPTCHA COMPONENT */}
          <CaptchaSection
            captchaType={captchaType}
            challenge={challenge}
            answer={answer}
            setAnswer={setAnswer}
            imageOptions={imageOptions}
            correctLabel={correctLabel}
            selectedIndexes={selectedIndexes}
            toggleSelect={toggleSelect}
            generateArithmetic={generateArithmetic}
            generateImageCaptcha={generateImageCaptcha}
          />

          {error && (
            <p className="text-sm text-red-600 mt-2 dark:text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={failedAttempts >= maxAttempts}
            className="w-full mt-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-md hover:opacity-90 transition shadow-md"
          >
            Create Account
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-300">
            {message}
          </p>
        )}

        <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-600 hover:underline">
            Sign in
          </Link>
        </p>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-purple-600 hover:text-purple-800 flex items-center justify-center text-sm font-medium"
          >
            <span className="mr-1">←</span> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupComponent;
