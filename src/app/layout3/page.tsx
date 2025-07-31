"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  timestamp: number; // em segundos
}

const questions: Question[] = [
  {
    id: 1,
    question: "Qual objeto NÃO aparece na imagem?",
    options: ["Calculadora", "Tablet", "Agenda", "Mouse", "Xícara de café"],
    correctAnswer: 3,
    timestamp: 5, // aparece aos 5 segundos
  },
  {
    id: 2,
    question: "Qual é a cor da tela do tablet que está sendo segurado?",
    options: ["Azul", "Vermelha", "Verde", "Amarela", "Branca"],
    correctAnswer: 2,
    timestamp: 10, // aparece aos 10 segundos
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
    timestamp: 15, // aparece aos 15 segundos
  },
];

export default function QuizLayout3() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<
    number | null
  >(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const currentQuestion =
    currentQuestionIndex !== null ? questions[currentQuestionIndex] : null;
  const allQuestionsAnswered = answeredQuestions.length === questions.length;

  // Monitora o tempo do vídeo
  const handleTimeUpdate = () => {
    if (!videoRef.current || showQuiz || allQuestionsAnswered) return;

    const currentTime = Math.floor(videoRef.current.currentTime);

    // Verifica se chegou em algum timestamp de pergunta
    const questionToShow = questions.find(
      (q, index) =>
        q.timestamp === currentTime && !answeredQuestions.includes(index)
    );

    if (questionToShow) {
      const questionIndex = questions.indexOf(questionToShow);
      setCurrentQuestionIndex(questionIndex);
      setShowQuiz(true);
      setVideoPaused(true);
      videoRef.current.pause();
    }
  };

  const handleAnswerClick = (optionIndex: number) => {
    if (selectedAnswer === null && currentQuestion) {
      setSelectedAnswer(optionIndex);
      setShowFeedback(true);

      // Incrementa o contador se a resposta estiver correta
      if (optionIndex === currentQuestion.correctAnswer) {
        setCorrectAnswers((prev) => prev + 1);
      }
    }
  };

  const handleContinue = () => {
    if (currentQuestionIndex !== null) {
      // Marca a pergunta como respondida
      setAnsweredQuestions((prev) => [...prev, currentQuestionIndex]);

      // Reset states
      setShowQuiz(false);
      setShowFeedback(false);
      setSelectedAnswer(null);
      setCurrentQuestionIndex(null);
      setVideoPaused(false);

      // Retoma o vídeo
      if (videoRef.current) {
        videoRef.current.play();
      }
    }
  };

  const handleVideoEnd = () => {
    if (allQuestionsAnswered) {
      setShowResult(true);
    }
  };

  const getOptionClass = (optionIndex: number) => {
    if (!showFeedback || selectedAnswer === null || !currentQuestion) {
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
        <Link href="/layout2" className={styles.layoutButton}>
          Layout 2 (Overlay)
        </Link>
        <Link
          href="/layout3"
          className={`${styles.layoutButton} ${styles.active}`}
        >
          Layout 3 (Timeline)
        </Link>
      </div>

      <main className={styles.main}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Quiz Educacional - Timeline</h1>
          <span className={styles.questionTracker}>
            {answeredQuestions.length}/{questions.length}
          </span>
        </div>

        <div className={styles.videoContainer}>
          <video
            ref={videoRef}
            className={`${styles.video} ${
              videoPaused ? styles.videoBlurred : ""
            }`}
            controls
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnd}
          >
            <source src="/sample-video.mp4" type="video/mp4" />
            Seu navegador não suporta o elemento de vídeo.
          </video>

          {/* Quiz Overlay */}
          {showQuiz && currentQuestion && (
            <div className={`${styles.quizOverlay} ${styles.fadeIn}`}>
              <div className={styles.quizContainer}>
                <div className={styles.progressIndicator}>
                  ⏱️ Pergunta aos {Math.floor(currentQuestion.timestamp / 60)}:
                  {(currentQuestion.timestamp % 60).toString().padStart(2, "0")}
                </div>

                <div
                  className={`${styles.questionBlock} ${styles.fadeInQuestion}`}
                >
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

                      <button
                        className={styles.nextButton}
                        onClick={handleContinue}
                      >
                        Continuar ▶️
                      </button>
                    </div>
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
                  <h2 className={styles.resultTitle}>🎉 Vídeo Concluído!</h2>
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
                    Assistir Novamente
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
