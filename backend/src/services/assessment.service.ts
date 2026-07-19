import prisma from '../config/database';
import { NotFoundError, ForbiddenError, BadRequestError, CooldownError } from '../middleware/error.middleware';
import { recordActivity } from './activity.service';
import { CourseService } from './course.service';
import { isUnitComplete } from '../utils/unit-progress';

interface QuizAnswer {
  questionId: string;
  answer: string;
}

interface SubmitQuizInput {
  familyId: string;
  memberId: string;
  unitId: string;
  answers: QuizAnswer[];
  timeSpent?: number;
}

interface GenerateQuestionsInput {
  unitId: string;
  count?: number;
  types?: string[];
}

const COOLDOWN_MINUTES = 15;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export class AssessmentService {
  static async getQuestions(unitId: string) {
    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
    });

    if (!unit) {
      throw new NotFoundError('Unit not found');
    }

    // correctAnswer and explanation are intentionally excluded — answers must not
    // be sent to the client before submission. The graded submitQuiz() response
    // carries correctAnswer + explanation for the post-quiz review panel.
    const questions = await prisma.question.findMany({
      where: { unitId },
      select: {
        id: true,
        type: true,
        questionText: true,
        options: true,
        difficulty: true,
      },
    });

    // Shuffle questions and options so answer positions vary across retries
    const shuffled = shuffle(questions).map(q => ({
      ...q,
      options: Array.isArray(q.options) ? shuffle(q.options as unknown[]) : q.options,
    }));

    return shuffled;
  }

  static async getCooldownStatus(memberId: string, unitId: string): Promise<{
    onCooldown: boolean;
    retryAfterMinutes: number;
    retryAt: string | null;
  }> {
    const lastAttempt = await prisma.quizResult.findFirst({
      where: { memberId, unitId },
      orderBy: { createdAt: 'desc' },
    });

    if (!lastAttempt || lastAttempt.passed) {
      return { onCooldown: false, retryAfterMinutes: 0, retryAt: null };
    }

    const minutesSince = (Date.now() - lastAttempt.createdAt.getTime()) / 60000;
    if (minutesSince >= COOLDOWN_MINUTES) {
      return { onCooldown: false, retryAfterMinutes: 0, retryAt: null };
    }

    const retryAfterMinutes = Math.ceil(COOLDOWN_MINUTES - minutesSince);
    const retryAt = new Date(lastAttempt.createdAt.getTime() + COOLDOWN_MINUTES * 60000).toISOString();
    return { onCooldown: true, retryAfterMinutes, retryAt };
  }

  static async submitQuiz(input: SubmitQuizInput) {
    const { familyId, memberId, unitId, answers, timeSpent } = input;

    // Verify member belongs to family
    const member = await prisma.familyMember.findFirst({
      where: { id: memberId, familyId },
    });

    if (!member) {
      throw new ForbiddenError('Member not found or does not belong to your family');
    }

    // Reading gate: enrolled students must complete the lesson before quizzing.
    // Unenrolled users (browsing without enrolling) are allowed through.
    const gateUnit = await prisma.unit.findUnique({ where: { id: unitId }, select: { courseId: true } });
    if (gateUnit) {
      const enrollment = await prisma.courseEnrollment.findUnique({
        where: { memberId_courseId: { memberId, courseId: gateUnit.courseId } },
      });
      if (enrollment) {
        const unitProgress = await prisma.unitProgress.findUnique({
          where: { enrollmentId_unitId: { enrollmentId: enrollment.id, unitId } },
        });
        if (!unitProgress?.readingCompleted) {
          throw new BadRequestError('You must complete the lesson reading before taking the quiz.');
        }
      }
    }

    // Enforce cooldown: block rapid retries after a failed attempt
    const cooldown = await AssessmentService.getCooldownStatus(memberId, unitId);
    if (cooldown.onCooldown) {
      throw new CooldownError(
        'You must wait before retrying this quiz.',
        cooldown.retryAfterMinutes,
        cooldown.retryAt!,
      );
    }

    // Get questions with correct answers
    const questions = await prisma.question.findMany({
      where: { unitId },
    });

    if (questions.length === 0) {
      throw new NotFoundError('No questions found for this unit');
    }

    // Grade answers
    let correctCount = 0;
    const gradedAnswers = answers.map(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      const isCorrect = question?.correctAnswer === answer.answer;
      if (isCorrect) correctCount++;
      
      return {
        questionId: answer.questionId,
        answer: answer.answer,
        isCorrect,
        correctAnswer: question?.correctAnswer,
        explanation: question?.explanation,
      };
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= 70;

    // Save quiz result
    const result = await prisma.quizResult.create({
      data: {
        memberId,
        unitId,
        score,
        passed,
        timeSpent: timeSpent || null,
        answers: gradedAnswers,
      },
    });

    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      select: {
        id: true,
        title: true,
        courseId: true,
        course: {
          select: {
            title: true,
          },
        },
      },
    });

    // Update unit progress if passed
    if (passed && unit) {
      const enrollment = await prisma.courseEnrollment.findUnique({
        where: { memberId_courseId: { memberId, courseId: unit.courseId } },
      });

      if (enrollment) {
        const existingProgress = await prisma.unitProgress.findUnique({
          where: { enrollmentId_unitId: { enrollmentId: enrollment.id, unitId } },
        });
        const nowCompleted = isUnitComplete({
          ...existingProgress,
          quizCompleted: true,
        });

        await prisma.unitProgress.upsert({
          where: { enrollmentId_unitId: { enrollmentId: enrollment.id, unitId } },
          create: {
            enrollmentId: enrollment.id,
            unitId,
            quizCompleted: true,
            quizScore: score,
            completedAt: nowCompleted ? new Date() : null,
          },
          update: {
            quizCompleted: true,
            quizScore: score,
            completedAt: nowCompleted ? existingProgress?.completedAt ?? new Date() : null,
          },
        });

        const enrollmentProgress = await CourseService.updateCourseProgress(enrollment.id);
        if (enrollmentProgress?.previousStatus !== 'COMPLETED' && enrollmentProgress?.status === 'COMPLETED') {
          try {
            await recordActivity(memberId, member.familyId, 'COURSE_COMPLETED', {
              courseId: unit.courseId,
              courseTitle: unit.course.title,
              unitId: unit.id,
              unitTitle: unit.title,
            });
          } catch (err) {
            console.error('Failed to record course completion activity:', err);
          }
        }
      }
    }

    // Record activity for dashboard
    try {
      if (member) {
        await recordActivity(memberId, member.familyId, 'QUIZ_COMPLETED', {
          courseId: unit?.courseId,
          courseTitle: unit?.course.title,
          unitId,
          unitTitle: unit?.title,
          score,
          passed,
        });
      }
    } catch (err) {
      console.error('Failed to record quiz activity:', err);
    }

    // Award points and mark activity
    const points = passed ? (score === 100 ? 100 : 50) : 10;
    await prisma.familyMember.update({
      where: { id: memberId },
      data: {
        totalPoints: { increment: points },
        lastActiveAt: new Date(),
      },
    });

    return {
      id: result.id,
      score,
      passed,
      correctCount,
      totalQuestions: questions.length,
      pointsEarned: points,
      answers: gradedAnswers,
    };
  }

  static async getMemberResults(familyId: string, memberId: string) {
    // Verify member belongs to family
    const member = await prisma.familyMember.findFirst({
      where: { id: memberId, familyId },
    });

    if (!member) {
      throw new ForbiddenError('Member not found or does not belong to your family');
    }

    const results = await prisma.quizResult.findMany({
      where: { memberId },
      orderBy: { createdAt: 'desc' },
      include: {
        unit: {
          select: { title: true, course: { select: { title: true } } },
        },
      },
    });

    return results;
  }

  static async getQuizResult(familyId: string, resultId: string) {
    const result = await prisma.quizResult.findUnique({
      where: { id: resultId },
      include: {
        member: true,
        unit: { include: { course: true } },
      },
    });

    if (!result) {
      throw new NotFoundError('Quiz result not found');
    }

    if (result.member.familyId !== familyId) {
      throw new ForbiddenError('Cannot access results from another family');
    }

    return result;
  }

  static async generateQuestions(input: GenerateQuestionsInput) {
    const { unitId, count = 5, types } = input;

    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      include: { arabicTerms: true },
    });

    if (!unit) {
      throw new NotFoundError('Unit not found');
    }

    // TODO: Implement AI question generation using OpenAI
    // For now, return placeholder
    return {
      message: 'AI question generation not yet implemented',
      unitId,
      requestedCount: count,
      types,
    };
  }
}
