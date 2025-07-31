"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const questions: Question[] = [
  {
    id: 1,
    question: "Qual objeto NÃO aparece na imagem?",
    options: ["Calculadora", "Tablet", "Agenda", "Mouse", "Xícara de café"],
    correctAnswer: 3,
  },
  {
    id: 2,
    question: "Qual é a cor da tela do tablet que está sendo segurado?",
    options: ["Azul", "Vermelha", "Verde", "Amarela", "Branca"],
    correctAnswer: 2,
  },
  {
    id: 3,
    question: "O que está em cima da agenda?",
    options: [
      "Um lápis",
      "Uma colher",
      "Um celular",
      "Uma caneta",
      "Um fone de ouvido",
    ],
    correctAnswer: 0,
  },
];

export default function QuizLayout2() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setTimeout(() => {
      setShowQuiz(true);
    }, 100);
  };

  const handleAnswerClick = (optionIndex: number) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(optionIndex);
      setShowFeedback(true);

      // Incrementa o contador se a resposta estiver correta
      if (optionIndex === currentQuestion.correctAnswer) {
        setCorrectAnswers((prev) => prev + 1);
      }
    }
  };

  const handleNextQuestion = () => {
    if (!isLastQuestion) {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleShowResult = () => {
    setShowQuiz(false);
    setShowResult(true);
  };

  const getOptionClass = (optionIndex: number) => {
    if (!showFeedback || selectedAnswer === null) {
      return styles.option;
    }

    if (optionIndex === currentQuestion.correctAnswer) {
      return `${styles.option} ${styles.correct}`;
    } else if (optionIndex === selectedAnswer) {
      return `${styles.option} ${styles.incorrect}`;
    }

    return styles.option;
  };

  return (
    <div className={styles.page}>
      {/* Navegação entre layouts */}
      <div className={styles.layoutSwitcher}>
        <Link href="/" className={styles.layoutButton}>
          Layout 1 (Lado a lado)
        </Link>
        <Link
          href="/layout2"
          className={`${styles.layoutButton} ${styles.active}`}
        >
          Layout 2 (Overlay)
        </Link>
      </div>

      <main className={styles.main}>
        <h1 className={styles.title}>Quiz Educacional</h1>

        <div className={styles.videoContainer}>
          <video
            ref={videoRef}
            className={`${styles.video} ${
              videoEnded ? styles.videoBlurred : ""
            }`}
            controls
            onEnded={handleVideoEnd}
          >
            <source src="/sample-video.mp4" type="video/mp4" />
            Seu navegador não suporta o elemento de vídeo.
          </video>

          {/* Quiz Overlay */}
          {showQuiz && (
            <div
              className={`${styles.quizOverlay} ${
                showQuiz ? styles.fadeIn : ""
              }`}
            >
              <div className={styles.quizContainer}>
                <div
                  className={`${styles.questionBlock} ${
                    isTransitioning ? styles.fadeOut : styles.fadeInQuestion
                  }`}
                >
                  <div className={styles.progressIndicator}>
                    Pergunta {currentQuestionIndex + 1} de {questions.length}
                  </div>

                  <div className={styles.questionHeader}>
                    <div className={styles.questionSection}>
                      <h3 className={styles.questionTitle}>
                        {currentQuestion.question}
                      </h3>
                    </div>

                    <div className={styles.answersSection}>
                      <div className={styles.optionsContainer}>
                        {currentQuestion.options.map((option, index) => (
                          <button
                            key={index}
                            className={getOptionClass(index)}
                            onClick={() => handleAnswerClick(index)}
                            disabled={showFeedback}
                          >
                            {String.fromCharCode(65 + index)}. {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {showFeedback && (
                    <div className={styles.feedbackContainer}>
                      <div
                        className={`${styles.feedback} ${
                          selectedAnswer === currentQuestion.correctAnswer
                            ? styles.correctFeedback
                            : styles.incorrectFeedback
                        }`}
                      >
                        {selectedAnswer === currentQuestion.correctAnswer
                          ? "✓ Resposta correta!"
                          : `✗ Resposta incorreta. A resposta correta é: ${String.fromCharCode(
                              65 + currentQuestion.correctAnswer
                            )}. ${
                              currentQuestion.options[
                                currentQuestion.correctAnswer
                              ]
                            }`}
                      </div>
                    </div>
                  )}

                  {!isLastQuestion ? (
                    <button
                      className={`${styles.nextButton} ${
                        !showFeedback ? styles.nextButtonDisabled : ""
                      }`}
                      onClick={handleNextQuestion}
                      disabled={!showFeedback}
                    >
                      Próxima Pergunta →
                    </button>
                  ) : (
                    showFeedback && (
                      <button
                        className={styles.nextButton}
                        onClick={handleShowResult}
                      >
                        Ver Resultado 🎉
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tela de Resultado */}
          {showResult && (
            <div className={`${styles.quizOverlay} ${styles.fadeIn}`}>
              <div className={styles.resultContainer}>
                <div className={styles.resultContent}>
                  <h2 className={styles.resultTitle}>🎉 Quiz Concluído!</h2>
                  <div className={styles.resultScore}>
                    <div className={styles.scoreNumber}>
                      {correctAnswers}/{questions.length}
                    </div>
                    <div className={styles.scoreText}>
                      Você acertou {correctAnswers} de {questions.length}{" "}
                      perguntas
                    </div>
                    <div className={styles.scorePercentage}>
                      {Math.round((correctAnswers / questions.length) * 100)}%
                      de acertos
                    </div>
                  </div>
                  <button
                    className={styles.restartButton}
                    onClick={() => window.location.reload()}
                  >
                    Refazer Quiz
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
