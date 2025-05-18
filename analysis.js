// analysis.js

// This script assumes you pass the test result data in query parameters or localStorage.
// For demonstration, I will use localStorage to get the quiz results saved previously.

document.addEventListener("DOMContentLoaded", () => {
  // Retrieve quiz results from localStorage (adjust keys as per your main quiz page)
  // You should save these values on quiz completion in main quiz UI before redirecting here
  const totalQuestions = parseInt(localStorage.getItem("totalQuestions")) || 0;
  const correct = parseInt(localStorage.getItem("correctAnswers")) || 0;
  const wrong = parseInt(localStorage.getItem("wrongAnswers")) || 0;
  const unattempted = parseInt(localStorage.getItem("unattempted")) || 0;

  const attempted = totalQuestions - unattempted;
  const percent = totalQuestions === 0 ? 0 : Math.round((correct / totalQuestions) * 100);

  // Update the dashboard text fields
  document.getElementById("totalQuestions").textContent = totalQuestions;
  document.getElementById("attemptedQuestions").textContent = attempted;
  document.getElementById("correctAnswers").textContent = correct;
  document.getElementById("wrongAnswers").textContent = wrong;
  document.getElementById("unattempted").textContent = unattempted;

  document.getElementById("scoreText").textContent = `You scored ${percent}%`;
  document.getElementById("rawText").textContent = `(${correct} correct out of ${totalQuestions} questions)`;

  // Update progress bars width
  document.getElementById("correct-bar").style.width = `${(correct / totalQuestions) * 100}%`;
  document.getElementById("wrong-bar").style.width = `${(wrong / totalQuestions) * 100}%`;
  document.getElementById("unattempted-bar").style.width = `${(unattempted / totalQuestions) * 100}%`;

  // Update counts next to bars
  document.getElementById("correct-count").textContent = correct;
  document.getElementById("wrong-count").textContent = wrong;
  document.getElementById("unattempted-count").textContent = unattempted;

  // Button functionality
  document.getElementById("retakeBtn").addEventListener("click", () => {
    // Clear stored review flag and reload quiz
    localStorage.removeItem("reviewMode");
    window.location.href = "quiz.html"; // Adjust URL to your quiz page
  });

  document.getElementById("reviewBtn").addEventListener("click", () => {
    localStorage.setItem("reviewMode", "true");
    window.location.href = "quiz.html"; // Adjust URL to your quiz page
  });
});

  const quizData = JSON.parse(localStorage.getItem("quiz_data"));
  if (!quizData) {
    document.body.innerHTML = "<p>No quiz data found. Please take a test first.</p>";
  } else {
    document.getElementById("summary").innerHTML = `
      <p><strong>Subject:</strong> ${quizData.metadata.subject}</p>
      <p><strong>Topic:</strong> ${quizData.metadata.topic}</p>
      <p><strong>Score:</strong> ${quizData.score} / ${quizData.totalQuestions}</p>
      <p><strong>Time Taken:</strong> ${Math.floor(quizData.timeTaken / 60)} min ${quizData.timeTaken % 60} sec</p>
      <p><strong>Attempted:</strong> ${quizData.answers.filter(x => x !== undefined).length}</p>
      <p><strong>Correct:</strong> ${quizData.questions.filter((q, i) => q.correctAnswer === quizData.answers[i]).length}</p>
      <p><strong>Incorrect:</strong> ${quizData.answers.filter((a, i) => a !== undefined && a !== quizData.questions[i].correctAnswer).length}</p>
    `;

    const reviewContainer = document.getElementById("review");
    quizData.questions.forEach((q, i) => {
      const userAnswer = quizData.answers[i];
      const correct = q.correctAnswer;
      const status = userAnswer === correct ? "✅ Correct" : "❌ Incorrect";
      reviewContainer.innerHTML += `
        <div class="review-question">
          <p><strong>Q${i+1}:</strong> ${q.question}</p>
          <ul>
            ${q.options.map((opt, index) => `
              <li style="color: ${index === correct ? 'green' : (index === userAnswer ? 'red' : 'black')}">
                ${opt} ${index === correct ? '✔' : ''} ${index === userAnswer && index !== correct ? '✖' : ''}
              </li>
            `).join('')}
          </ul>
          <p>${status}</p>
          <hr>
        </div>
      `;
    });
  }

  document.getElementById("retakeTestBtn").addEventListener("click", () => {
    // Retake: regenerate with same settings
    const params = new URLSearchParams(quizData.metadata).toString();
    window.location.href = `quiz.html?${params}`;
  });
// On retake button click
document.getElementById("retakeTestBtn").addEventListener("click", () => {
  const data = JSON.parse(localStorage.getItem("quiz_data"));
  const params = new URLSearchParams(data.metadata).toString();
  window.location.href = `quiz.html?${params}`;
});
