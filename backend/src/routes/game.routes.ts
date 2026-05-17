import { Router } from 'express';
import { param, body, query } from 'express-validator';
import { GameController } from '../controllers/game.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate, requireParent } from '../middleware/auth.middleware';

const router = Router();

// All game routes require authentication (parent or child JWT)
router.use(authenticate);

// ---------------------------------------------------------------------------
// Validation schemas
// ---------------------------------------------------------------------------

const uuidParam = (name: string) => param(name).isUUID().withMessage(`Valid ${name} is required`);

const startGameValidation = [
  body('gameId').isUUID().withMessage('Valid gameId is required'),
  body('memberId').isUUID().withMessage('Valid memberId is required'),
  body('gameType').optional().isString(),
  body('difficulty').optional().isIn(['EASY', 'MEDIUM', 'HARD']).withMessage('difficulty must be EASY, MEDIUM, or HARD'),
  body('unitId').optional().isUUID(),
  body('courseId').optional().isUUID(),
];

const submitRoundValidation = [
  uuidParam('sessionId'),
  uuidParam('roundId'),
  body('answer').exists().withMessage('answer is required'),
  body('timeSpentMs').optional().isInt({ min: 0 }),
];

const dailyChallengeSubmitValidation = [
  body('challengeId').isUUID().withMessage('challengeId is required'),
  body('answers').isArray({ min: 1 }).withMessage('answers array is required'),
  body('answers.*.contentId').isUUID().withMessage('Valid contentId required'),
  body('answers.*.answer').notEmpty().withMessage('answer is required'),
  body('answers.*.timeSpentMs').isInt({ min: 0 }).withMessage('timeSpentMs must be >= 0'),
  body('memberId').optional().isUUID(),
];

const updateGameSettingsValidation = [
  uuidParam('memberId'),
  body('dailyLimitMinutes').optional().isInt({ min: 0, max: 480 }),
  body('weekendLimitMinutes').optional().isInt({ min: 0, max: 480 }),
  body('allowedGameTypes').optional().isArray(),
  body('maxDifficulty').optional().isIn(['EASY', 'MEDIUM', 'HARD']),
  body('enforceAfterHour').optional({ nullable: true }).isInt({ min: 0, max: 23 }),
  body('isActive').optional().isBoolean(),
];

// ---------------------------------------------------------------------------
// Game Discovery
// ---------------------------------------------------------------------------

router.get('/', GameController.getAvailableGames);
router.get('/available', GameController.getAvailableGames);

router.get(
  '/unit/:unitId',
  validate([uuidParam('unitId')]),
  GameController.getGamesForUnit,
);

router.get(
  '/course/:courseId',
  validate([uuidParam('courseId')]),
  GameController.getGamesForCourse,
);

router.get('/standalone', GameController.getStandaloneGames);

// ---------------------------------------------------------------------------
// Session Lifecycle
// ---------------------------------------------------------------------------

router.post('/start', validate(startGameValidation), GameController.startGame);

router.post(
  '/sessions/:sessionId/rounds/:roundId/submit',
  validate(submitRoundValidation),
  GameController.submitRound,
);

router.post(
  '/sessions/:sessionId/complete',
  validate([uuidParam('sessionId')]),
  GameController.completeGame,
);

router.get(
  '/sessions/:sessionId',
  validate([uuidParam('sessionId')]),
  GameController.getSession,
);

// ---------------------------------------------------------------------------
// Scores & Leaderboard
// ---------------------------------------------------------------------------

router.get('/scores', GameController.getScores);

router.get(
  '/leaderboard/:gameType',
  validate([param('gameType').isString().notEmpty()]),
  GameController.getLeaderboard,
);

// ---------------------------------------------------------------------------
// Achievements
// ---------------------------------------------------------------------------

router.get('/achievements', GameController.getAchievements);
router.get('/achievements/recent', GameController.getRecentAchievements);

// ---------------------------------------------------------------------------
// Daily Challenge
// ---------------------------------------------------------------------------

router.get('/daily-challenge', GameController.getDailyChallenge);

router.post(
  '/daily-challenge/attempt',
  validate(dailyChallengeSubmitValidation),
  GameController.submitDailyChallengeAttempt,
);

// ---------------------------------------------------------------------------
// Parental Controls (parent only)
// ---------------------------------------------------------------------------

router.get(
  '/settings/:memberId',
  validate([uuidParam('memberId')]),
  requireParent,
  GameController.getGameSettings,
);

router.put(
  '/settings/:memberId',
  validate(updateGameSettingsValidation),
  requireParent,
  GameController.updateGameSettings,
);

router.get(
  '/time/:memberId',
  validate([uuidParam('memberId')]),
  requireParent,
  GameController.getGameTime,
);

export default router;
