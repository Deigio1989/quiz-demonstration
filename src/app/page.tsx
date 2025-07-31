"use client";

import { useState } from "react";
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

export default function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

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
      <main className={styles.main}>
        <div className={styles.contentContainer}>
          <div className={styles.videoContainer}>
            <h1 className={styles.title}>Quiz Educacional</h1>
            <video className={styles.video} controls>
              <source src="/sample-video.mp4" type="video/mp4" />
              Seu navegador não suporta o elemento de vídeo.
            </video>
          </div>

          <div className={styles.quizContainer}>
            <div className={styles.progressIndicator}>
              Pergunta {currentQuestionIndex + 1} de {questions.length}
            </div>

            <div
              className={`${styles.questionBlock} ${
                isTransitioning ? styles.fadeOut : styles.fadeIn
              }`}
            >
              <h3 className={styles.questionTitle}>
                {currentQuestion.question}
              </h3>
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
                          currentQuestion.options[currentQuestion.correctAnswer]
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
                  <div className={styles.completedMessage}>
                    🎉 Quiz concluído! Parabéns!
                    <div className={styles.scoreMessage}>
                      Você acertou {correctAnswers} de {questions.length}{" "}
                      perguntas
                      <div className={styles.percentage}>
                        ({Math.round((correctAnswers / questions.length) * 100)}
                        % de acertos)
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
