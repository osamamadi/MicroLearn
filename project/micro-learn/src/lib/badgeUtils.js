// src/lib/badgeUtils.js

/**
 * Calculates user badges and progress based on quiz history.
 * @param {Array<Object>} quizHistory - The user's quiz history.
 * @returns {Object} An object containing earned badges, progress towards the next badge, and all badge definitions.
 */
export function getUserBadges(quizHistory) {
  // <-- Make sure it's EXPORTED
  const badges = [];

  const badgeLevels = [
    { label: 'Beginner', emoji: '🐣', requiredQuizzes: 1, requiredScore: 0 },
    { label: 'Learner', emoji: '📘', requiredQuizzes: 3, requiredScore: 0.5 },
    { label: 'Brainiac', emoji: '🧠', requiredQuizzes: 5, requiredScore: 0.75 },
    { label: 'Perfect Score', emoji: '🔥', special: 'perfect' },
    { label: 'Consistent', emoji: '📈', special: 'streak' },
    { label: 'Explorer', emoji: '🧭', requiredQuizzes: 7, requiredScore: 0.6 },
    {
      label: 'Dedicated',
      emoji: '💪',
      requiredQuizzes: 10,
      requiredScore: 0.6,
    },
    {
      label: 'Quiz Master',
      emoji: '🏆',
      requiredQuizzes: 15,
      requiredScore: 0.7,
    },
    { label: 'Scholar', emoji: '📖', requiredQuizzes: 20, requiredScore: 0.8 },
    { label: 'Legend', emoji: '👑', requiredQuizzes: 25, requiredScore: 0.85 },
  ];

  const totalQuizzes = quizHistory?.length || 0;
  const totalScore = quizHistory?.reduce((sum, q) => sum + (q.score || 0), 0);
  const totalQuestions = quizHistory?.reduce(
    (sum, q) => sum + (q.totalQuestions || 0),
    0
  );
  const avgScore = totalQuestions > 0 ? totalScore / totalQuestions : 0;

  const sortedDates = quizHistory
    ?.map((q) => new Date(q.dateTaken).toDateString()) // Convert to date string to ignore time component
    .filter(Boolean)
    .sort();

  let streak = 1;
  // Improved streak logic: checks for consecutive days or same day
  if (sortedDates && sortedDates.length > 1) {
    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);

      // Check if dates are consecutive (exactly 24 hours apart or same day)
      // We already converted to date string above, so comparing time difference is simpler.
      // Or, better, check if the day is exactly one day after the previous one.
      const diffTime = Math.abs(curr.getTime() - prev.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // If it's the very next day
        streak++;
      } else if (diffDays > 1) {
        // If there's a gap of more than one day
        streak = 1;
      }
      // If diffDays is 0 (same day), streak continues, no reset
    }
  }

  const perfectScore = quizHistory?.some((q) => q.score === q.totalQuestions);

  const allBadges = badgeLevels.map((b) => {
    let earned = false;
    let progress = 0;

    if (b.special === 'perfect') {
      earned = perfectScore;
      progress = earned ? 100 : 0;
    } else if (b.special === 'streak') {
      earned = streak >= 3; // Streak requirement is 3 days
      progress = Math.min(100, Math.floor((streak / 3) * 100));
    } else {
      const quizProgress = Math.min(1, totalQuizzes / b.requiredQuizzes);
      const scoreProgress =
        b.requiredScore === 0 ? 1 : Math.min(1, avgScore / b.requiredScore);
      progress = Math.floor(quizProgress * scoreProgress * 100);
      earned = progress >= 100;
    }

    if (earned) {
      badges.push({ emoji: b.emoji, label: b.label });
    }

    return {
      ...b,
      progress,
      earned,
    };
  });

  const nextBadge = allBadges.find((b) => !b.earned && b.progress < 100);

  return {
    badges,
    badgeProgress: nextBadge
      ? {
          emoji: nextBadge.emoji,
          label: nextBadge.label,
          progress: nextBadge.progress,
        }
      : null,
    allBadges,
  };
}
