import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, XCircle, HelpCircle, ChevronRight, Loader2, SkipForward, Timer } from 'lucide-react';
import { assessmentService } from '@/services/assessmentService';
import { courseService } from '@/services/courseService';
import { getCourseLearnPath, getUnitPath } from '@/utils/courseRoutePaths';
import type { QuizSubmissionResponse } from '@/types';

type QuestionType = 'multiple-choice' | 'true-false' | 'fill-blank' | 'ordering' | 'matching';

// correctAnswer and explanation are NOT included — the backend withholds them
// until after submission. Graded results come from QuizSubmissionResponse.answers.
interface Question {
  id: string;
  unitId: string;
  type: QuestionType;
  question: string;
  questionText?: string;
  options?: string[];
  points: number;
  difficulty: string;
}

export default function QuizPage() {
  const { courseId, unitId } = useParams<{ courseId: string; unitId: string }>();
  const location = useLocation();
  const unitPath = courseId && unitId ? getUnitPath(location.pathname, courseId, unitId) : '/courses';
  const courseLearnPath = courseId ? getCourseLearnPath(location.pathname, courseId) : '/courses';
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [skipped, setSkipped] = useState<Set<number>>(new Set());
  const [showResults, setShowResults] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [nextUnitId, setNextUnitId] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<QuizSubmissionResponse | null>(null);
  const [cooldownEndsAt, setCooldownEndsAt] = useState<Date | null>(null);
  const [cooldownSecondsLeft, setCooldownSecondsLeft] = useState(0);

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!unitId) return;
      
      try {
        setLoading(true);
        const [data] = await Promise.all([
          assessmentService.getQuizQuestions(unitId),
          // Check cooldown status concurrently on page load
          assessmentService.getCooldownStatus(unitId).then((status) => {
            if (status.onCooldown && status.retryAt) {
              setCooldownEndsAt(new Date(status.retryAt));
            }
          }).catch(() => {
            // Cooldown check failure is non-blocking
          }),
        ]);
        
        // Transform API response to Question format (no correctAnswer/explanation from GET)
        const transformedQuestions: Question[] = data.map((q: any) => ({
          id: q.id,
          unitId: unitId,
          type: (q.type.toLowerCase().replaceAll('_', '-')) as QuestionType,
          question: q.questionText || q.question,
          options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
          points: 1,
          difficulty: q.difficulty || 'medium',
        }));
        
        setQuestions(transformedQuestions);
      } catch (err) {
        console.error('Failed to fetch questions:', err);
        // Fallback to sample questions for demo
        setQuestions([
          {
            id: '1',
            unitId: unitId,
            type: 'multiple-choice',
            question: 'What is the meaning of Tawheed?',
            options: [
              'The oneness of Allah',
              'The five pillars of Islam',
              'The prophets of Allah',
              'The angels of Allah'
            ],
            points: 1,
            difficulty: 'medium'
          },
          {
            id: '2',
            unitId: unitId,
            type: 'true-false',
            question: 'Muslims believe in all the prophets sent by Allah.',
            options: ['True', 'False'],
            points: 1,
            difficulty: 'easy'
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [unitId]);

  // Fetch next unit for navigation
  useEffect(() => {
    const fetchNextUnit = async () => {
      if (!courseId || !unitId) return;
      
      try {
        const units = await courseService.getUnits(courseId);
        const currentUnitIndex = units.findIndex(u => u.id === unitId);
        
        if (currentUnitIndex >= 0 && currentUnitIndex < units.length - 1) {
          setNextUnitId(units[currentUnitIndex + 1].id);
        } else {
          setNextUnitId(null);
        }
      } catch (err) {
        console.error('Failed to fetch units for navigation:', err);
        setNextUnitId(null);
      }
    };

    fetchNextUnit();
  }, [courseId, unitId]);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  useEffect(() => {
    if (!showResults && !loading) {
      const timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showResults, loading]);

  // Cooldown countdown — ticks every second until retryAt is reached
  useEffect(() => {
    if (!cooldownEndsAt) return;
    const tick = () => {
      const remaining = Math.max(0, Math.floor((cooldownEndsAt.getTime() - Date.now()) / 1000));
      setCooldownSecondsLeft(remaining);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [cooldownEndsAt]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
    // Remove from skipped when answered
    setSkipped((prev) => {
      const newSkipped = new Set(prev);
      newSkipped.delete(currentIndex);
      return newSkipped;
    });
  };

  const handleSkip = () => {
    // Mark as skipped and move to next
    setSkipped((prev) => new Set(prev).add(currentIndex));
    if (isLastQuestion) {
      // If skipping last question, go to first unanswered
      const firstUnanswered = questions.findIndex((q, idx) => !answers[q.id] && idx !== currentIndex);
      setCurrentIndex(firstUnanswered >= 0 ? firstUnanswered : 0);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleGoToQuestion = (index: number) => {
    setCurrentIndex(index);
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    
    try {
      // Build answers array — correctness is determined server-side
      const answersArray = questions.map((q) => ({
        questionId: q.id,
        answer: answers[q.id] || '',
      }));
      
      if (unitId) {
        const result = await assessmentService.submitQuiz({
          unitId,
          answers: answersArray,
          timeSpent: timeElapsed,
        });
        setSubmitResult(result);

        // After a failed attempt, fetch the authoritative cooldown window from the backend
        if (!result.passed) {
          try {
            const cooldownStatus = await assessmentService.getCooldownStatus(unitId);
            if (cooldownStatus.onCooldown && cooldownStatus.retryAt) {
              setCooldownEndsAt(new Date(cooldownStatus.retryAt));
            } else {
              // Fallback: 15-minute cooldown from now
              setCooldownEndsAt(new Date(Date.now() + 15 * 60 * 1000));
            }
          } catch {
            // Fallback: 15-minute cooldown from now
            setCooldownEndsAt(new Date(Date.now() + 15 * 60 * 1000));
          }
        }
      }
    } catch (err: any) {
      // Handle 429 — backend rejected because cooldown is still active
      if (err.response?.status === 429) {
        const { retryAfterMinutes, retryAt } = err.response.data ?? {};
        if (retryAt) {
          setCooldownEndsAt(new Date(retryAt));
        } else if (retryAfterMinutes) {
          setCooldownEndsAt(new Date(Date.now() + retryAfterMinutes * 60 * 1000));
        }
      }
      console.error('Failed to submit quiz:', err);
      // Continue showing results even if submission fails; score will be unavailable
    } finally {
      setSubmitting(false);
      setShowResults(true);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmitQuiz();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const calculateScore = () => {
    if (submitResult) {
      return {
        correct: submitResult.correctCount,
        total: submitResult.totalQuestions,
        percentage: submitResult.score,
      };
    }
    // Fallback when submit failed — show zeros
    return { correct: 0, total: questions.length, percentage: 0 };
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  // No questions available
  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-yellow-50 rounded-xl p-8">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">No Questions Available</h2>
          <p className="text-yellow-600 mb-4">There are no quiz questions for this unit yet.</p>
          <Link
            to={unitPath}
            className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Unit
          </Link>
        </div>
      </div>
    );
  }

  // Pre-quiz cooldown screen — student must wait before retrying
  if (!showResults && cooldownSecondsLeft > 0) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in">
        <div className="flex items-center justify-between">
          <Link
            to={unitPath}
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Unit
          </Link>
        </div>
        <div className="bg-white rounded-xl p-8 shadow-sm border border-amber-200 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
            <Timer className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-gray-800 mb-2">Quiz Locked</h1>
          <p className="text-gray-600 mb-6">
            Take some time to review the lesson before retrying.
          </p>
          <div className="bg-amber-50 rounded-lg p-6 mb-6">
            <p className="text-sm text-amber-700 font-medium mb-2">Retry available in</p>
            <p className="text-4xl font-mono font-bold text-amber-600">{formatTime(cooldownSecondsLeft)}</p>
          </div>
          <Link
            to={unitPath}
            className="inline-flex items-center px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Review the Lesson
          </Link>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const passed = submitResult?.passed ?? score.percentage >= 70;

    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in">
        <div className={`bg-white rounded-xl p-8 shadow-sm border ${passed ? 'border-green-200' : 'border-red-200'} text-center`}>
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
            {passed ? (
              <CheckCircle className="w-10 h-10 text-green-600" />
            ) : (
              <XCircle className="w-10 h-10 text-red-600" />
            )}
          </div>
          
          <h1 className="text-2xl font-heading font-bold text-gray-800 mb-2">
            {passed ? 'Congratulations! 🎉' : 'Keep Practicing! 💪'}
          </h1>
          <p className="text-gray-600 mb-6">
            {passed 
              ? "You've passed the quiz! Great job learning."
              : "You need 70% to pass. Review the lesson and try again."}
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-primary-600">{score.percentage}%</p>
                <p className="text-sm text-gray-500">Score</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{score.correct}/{score.total}</p>
                <p className="text-sm text-gray-500">Correct</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{formatTime(timeElapsed)}</p>
                <p className="text-sm text-gray-500">Time</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={unitPath}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Unit
            </Link>
            {!passed && cooldownSecondsLeft === 0 && (
              <button
                onClick={() => {
                  setCooldownEndsAt(null);
                  setShowResults(false);
                  setCurrentIndex(0);
                  setAnswers({});
                  setSkipped(new Set());
                  setTimeElapsed(0);
                  setSubmitResult(null);
                }}
                className="px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition"
              >
                Try Again
              </button>
            )}
            {passed && (
              <Link
                to={nextUnitId && courseId ? getUnitPath(location.pathname, courseId, nextUnitId) : courseLearnPath}
                className="px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition flex items-center justify-center"
              >
                {nextUnitId ? 'Next Unit' : 'Back to Course'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            )}
          </div>
        </div>

        {/* Cooldown countdown — shown after a failed attempt while the window is active */}
        {!passed && cooldownSecondsLeft > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-200 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Timer className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-semibold text-gray-800">Take some time to review the lesson before retrying</h2>
            </div>
            <p className="text-sm text-amber-700 font-medium mb-1">Retry available in</p>
            <p className="text-3xl font-mono font-bold text-amber-600">{formatTime(cooldownSecondsLeft)}</p>
          </div>
        )}

        {/* Review Answers — full details only for passed attempts */}
        {passed ? (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Review Your Answers</h2>
            <div className="space-y-4">
              {questions.map((q, idx) => {
                const graded = submitResult?.answers.find(a => a.questionId === q.id);
                const userAnswer = graded?.answer ?? answers[q.id];
                const isCorrect = graded?.isCorrect ?? false;
                return (
                  <div key={q.id} className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="flex items-start space-x-3">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium text-gray-800">{idx + 1}. {q.question || q.questionText}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Your answer: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>{userAnswer || 'Not answered'}</span>
                        </p>
                        {!isCorrect && graded?.correctAnswer && (
                          <p className="text-sm text-green-600 mt-1">
                            Correct answer: {graded.correctAnswer}
                          </p>
                        )}
                        {graded?.explanation && (
                          <p className="text-sm text-gray-500 mt-2 italic">{graded.explanation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {!submitResult && (
                <p className="text-sm text-gray-500 italic text-center py-2">
                  Results could not be retrieved from the server. Please try again.
                </p>
              )}
            </div>
          </div>
        ) : (
          /* Failed attempt — show right/wrong status only, no correct answers */
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Question Breakdown</h2>
            <p className="text-sm text-gray-500 mb-4">
              Review your lesson and try again after the cooldown period. Correct answers will be shown once you pass.
            </p>
            <div className="space-y-3">
              {questions.map((q, idx) => {
                const graded = submitResult?.answers.find(a => a.questionId === q.id);
                const userAnswer = graded?.answer ?? answers[q.id];
                const isCorrect = graded?.isCorrect ?? false;
                return (
                  <div key={q.id} className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="flex items-start space-x-3">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium text-gray-800">{idx + 1}. {q.question || q.questionText}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Your answer: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>{userAnswer || 'Not answered'}</span>
                        </p>
                        {/* Correct answer and explanation intentionally withheld on failure */}
                      </div>
                    </div>
                  </div>
                );
              })}
              {!submitResult && (
                <p className="text-sm text-gray-500 italic text-center py-2">
                  Results could not be retrieved from the server. Please try again.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to={unitPath}
          className="inline-flex items-center text-gray-600 hover:text-primary-600 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Exit Quiz
        </Link>
        <div className="flex items-center space-x-2 text-gray-600">
          <Clock className="w-5 h-5" />
          <span className="font-mono">{formatTime(timeElapsed)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary-500 h-2 rounded-full transition-all"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>
      <p className="text-sm text-gray-500 text-center">
        Question {currentIndex + 1} of {questions.length}
      </p>

      {/* Question Navigation Panel */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <p className="text-sm font-medium text-gray-700 mb-3">Question Overview</p>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, idx) => {
            const isAnswered = !!answers[q.id];
            const isSkipped = skipped.has(idx);
            const isCurrent = idx === currentIndex;
            
            return (
              <button
                key={q.id}
                onClick={() => handleGoToQuestion(idx)}
                className={`w-10 h-10 rounded-lg font-medium text-sm transition ${
                  isCurrent
                    ? 'bg-primary-500 text-white ring-2 ring-primary-300'
                    : isAnswered
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : isSkipped
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={isAnswered ? 'Answered' : isSkipped ? 'Skipped' : 'Not answered'}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-green-100 border border-green-300"></span>
            Answered
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-yellow-100 border border-yellow-300"></span>
            Skipped
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-gray-100 border border-gray-300"></span>
            Not answered
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-start space-x-3 mb-6">
          <HelpCircle className="w-6 h-6 text-primary-500 flex-shrink-0" />
          <h2 className="text-xl font-medium text-gray-800">
            {currentQuestion.question || currentQuestion.questionText}
          </h2>
        </div>

        {/* Multiple Choice / True-False Options */}
        {(currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'true-false') && currentQuestion.options?.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(option)}
            disabled={submitting}
            className={`w-full p-4 text-left rounded-lg border-2 transition mb-3 ${
              answers[currentQuestion.id] === option
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="font-medium text-gray-800">{option}</span>
          </button>
        ))}

        {/* Fill in the Blank Input */}
        {currentQuestion.type === 'fill-blank' && (
          <div className="space-y-3">
            <input
              type="text"
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Type your answer here..."
              disabled={submitting}
              className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
              dir="auto"
            />
            <p className="text-sm text-gray-500">
              💡 Tip: Type your answer carefully. Arabic text is supported.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0 || submitting}
          className="px-6 py-3 text-gray-600 font-medium rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Previous
        </button>
        
        <div className="flex gap-3">
          <button
            onClick={handleSkip}
            disabled={submitting}
            className="px-6 py-3 text-orange-600 font-medium rounded-lg border-2 border-orange-200 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            <SkipForward className="w-4 h-4" />
            Skip
          </button>
          
          <button
            onClick={handleNext}
            disabled={!answers[currentQuestion.id] || submitting}
            className="px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                {isLastQuestion ? 'Submit Quiz' : 'Next'}
                <ChevronRight className="w-5 h-5 inline ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
