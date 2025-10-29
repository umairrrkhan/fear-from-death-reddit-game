import { useState } from 'react';

const allQuestions = [
  { question: "Is ice cold?", correctAnswer: true, explanation: "Yes! Ice is frozen water! ❄️" },
  { question: "Do cats bark?", correctAnswer: false, explanation: "No! Cats meow, dogs bark! 🐱" },
  { question: "Is grass green?", correctAnswer: true, explanation: "Yes! Grass is green! 🌱" },
  { question: "Can birds fly?", correctAnswer: true, explanation: "Most birds can fly! 🐦" },
  { question: "Is fire hot?", correctAnswer: true, explanation: "Yes! Fire is very hot! 🔥" },
  { question: "Do fish live in water?", correctAnswer: true, explanation: "Yes! Fish need water to live! 🐟" },
  { question: "Is snow white?", correctAnswer: true, explanation: "Yes! Snow is white! ⛄" },
  { question: "Can elephants fly?", correctAnswer: false, explanation: "No! Elephants are too big to fly! 🐘" },
  { question: "Do bees make honey?", correctAnswer: true, explanation: "Yes! Bees make yummy honey! 🐝" },
  { question: "Is the moon round?", correctAnswer: true, explanation: "Yes! The moon is round! 🌙" },
  { question: "Do penguins live in hot places?", correctAnswer: false, explanation: "No! Penguins love cold places! 🐧" },
  { question: "Can you eat rocks?", correctAnswer: false, explanation: "No! Rocks are not food! 🪨" },
  { question: "Do flowers smell nice?", correctAnswer: true, explanation: "Most flowers smell beautiful! 🌸" },
  { question: "Is water wet?", correctAnswer: true, explanation: "Yes! Water is wet! 💧" },
  { question: "Can cars swim?", correctAnswer: false, explanation: "No! Cars drive on roads! 🚗" },
  { question: "Do dogs have tails?", correctAnswer: true, explanation: "Yes! Most dogs have tails! 🐕" },
  { question: "Is chocolate sweet?", correctAnswer: true, explanation: "Yes! Chocolate is sweet and yummy! 🍫" },
  { question: "Can trees walk?", correctAnswer: false, explanation: "No! Trees stay in one place! 🌳" },
  { question: "Do rabbits hop?", correctAnswer: true, explanation: "Yes! Rabbits love to hop! 🐰" },
  { question: "Is sand soft?", correctAnswer: true, explanation: "Yes! Sand feels soft! 🏖️" },
  { question: "Can fish breathe air?", correctAnswer: false, explanation: "No! Fish breathe underwater! 🐠" },
  { question: "Do cows say moo?", correctAnswer: true, explanation: "Yes! Cows go moo! 🐄" },
  { question: "Is pizza round?", correctAnswer: true, explanation: "Most pizzas are round! 🍕" },
  { question: "Can spiders fly?", correctAnswer: false, explanation: "No! Spiders crawl and make webs! 🕷️" },
  { question: "Do stars shine?", correctAnswer: true, explanation: "Yes! Stars twinkle in the sky! ⭐" },
  { question: "Is milk white?", correctAnswer: true, explanation: "Yes! Milk is white! 🥛" },
  { question: "Can books talk?", correctAnswer: false, explanation: "No! Books are quiet, we read them! 📚" },
  { question: "Do frogs jump?", correctAnswer: true, explanation: "Yes! Frogs are great jumpers! 🐸" },
  { question: "Is honey sweet?", correctAnswer: true, explanation: "Yes! Honey is very sweet! 🍯" },
  { question: "Can shoes walk by themselves?", correctAnswer: false, explanation: "No! We wear shoes to walk! 👟" }
];

const getRandomQuestions = () => {
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
};

export const App = () => {
  const [questions, setQuestions] = useState(getRandomQuestions());
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnswer = (answer: boolean) => {
    if (isAnimating) return;

    setUserAnswer(answer);
    setIsAnimating(true);

    const isCorrect = answer === questions[currentQuestion]?.correctAnswer;

    if (isCorrect) {
      setScore(score + 1);
    }

    setShowResult(true);

    setTimeout(() => {
      setShowResult(false);
      setIsAnimating(false);

      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setGameFinished(true);
      }
    }, 2500);
  };

  const resetGame = () => {
    setQuestions(getRandomQuestions());
    setCurrentQuestion(0);
    setScore(0);
    setGameFinished(false);
    setShowResult(false);
    setUserAnswer(null);
    setIsAnimating(false);
  };

  if (gameFinished) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-8 p-4 bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-400 animate-gradient-x">
        <div className="text-center animate-fade-in">
          <h1 className="text-5xl font-bold text-white mb-6 drop-shadow-lg animate-bounce">
            🎉 Game Complete! 🎉
          </h1>

          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl mb-6">
            <div className="text-8xl mb-4 animate-spin">
              {score === 3 ? '🏆' : score === 2 ? '🥈' : score === 1 ? '🥉' : '🎯'}
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-4">
              Score: {score}/3
            </p>
            <p className="text-xl text-gray-700 font-medium">
              {score === 3 ? '🌟 Perfect! You\'re amazing!' :
                score === 2 ? '🎊 Great job! Almost perfect!' :
                  score === 1 ? '👍 Good try! You got one right!' :
                    '😊 Keep trying! You\'ll get better!'}
            </p>
          </div>
        </div>

        <button
          onClick={resetGame}
          className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-5 px-10 rounded-full text-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-110 active:scale-95"
        >
          <span className="flex items-center gap-3">
            <span className="group-hover:animate-spin">🎮</span>
            Play Again
          </span>
        </button>

        <div className="text-white/80 text-center text-lg">
          <p>🎲 Get 3 new random questions!</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    const isCorrect = userAnswer === questions[currentQuestion]?.correctAnswer;
    return (
      <div className={`flex flex-col justify-center items-center min-h-screen gap-6 p-4 transition-all duration-500 ${isCorrect
        ? 'bg-gradient-to-br from-green-400 via-green-500 to-green-600'
        : 'bg-gradient-to-br from-red-400 via-red-500 to-red-600'
        }`}>
        <div className="text-center animate-bounce">
          <div className={`text-9xl mb-6 animate-pulse ${isCorrect ? 'animate-spin' : 'animate-bounce'
            }`}>
            {isCorrect ? '🎉' : '😅'}
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-transform">
            <h2 className={`text-4xl font-bold mb-4 ${isCorrect ? 'text-green-700' : 'text-red-700'
              }`}>
              {isCorrect ? '🌟 Awesome!' : '💭 Oops!'}
            </h2>
            <p className="text-xl text-gray-700 mb-4 font-medium">
              {questions[currentQuestion]?.explanation}
            </p>
            <div className="flex items-center justify-center gap-2 text-lg text-gray-600">
              <span className="bg-purple-100 px-3 py-1 rounded-full">
                Question {currentQuestion + 1} of 3
              </span>
              <span className="bg-blue-100 px-3 py-1 rounded-full">
                Score: {score}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-8 p-4 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 animate-gradient-x">
      <div className="text-center mb-4 animate-fade-in">
        <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
          🎯 Quick Quiz
        </h1>
        <div className="flex items-center justify-center gap-4 text-white/90">
          <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-lg font-semibold">
            Question {currentQuestion + 1} of 3
          </span>
          <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-lg font-semibold">
            Score: {score}
          </span>
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 transform hover:scale-105 transition-all duration-300">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4 animate-bounce">🤔</div>
          <h2 className="text-2xl font-bold text-gray-800 leading-relaxed">
            {questions[currentQuestion]?.question}
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleAnswer(true)}
            disabled={isAnimating}
            className={`group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-5 px-8 rounded-2xl text-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${isAnimating ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
              }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <span className="text-2xl group-hover:animate-bounce">✅</span>
              YES
            </span>
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
          </button>

          <button
            onClick={() => handleAnswer(false)}
            disabled={isAnimating}
            className={`group relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-5 px-8 rounded-2xl text-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${isAnimating ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
              }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <span className="text-2xl group-hover:animate-bounce">❌</span>
              NO
            </span>
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
          </button>
        </div>
      </div>

      <div className="text-center text-white/80 text-lg font-medium animate-pulse">
        🎮 Tap your answer!
      </div>
    </div>
  );
};
