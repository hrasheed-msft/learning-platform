import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ActiveMemberRequest } from '../middleware/requireActiveMember.middleware';
import { BadRequestError, ForbiddenError } from '../middleware/error.middleware';
import { CourseService } from '../services/course.service';

function resolveFamilyId(req: AuthenticatedRequest): string {
  if (req.child) {
    return req.child.familyId;
  }

  if (req.user) {
    return req.user.familyId;
  }

  throw new BadRequestError('Unable to determine family for this request');
}

function resolveAccessibleMemberId(
  req: ActiveMemberRequest,
  requestedMemberId?: string,
): string {
  const memberId = requestedMemberId ?? req.activeMemberId ?? req.child?.memberId;

  if (!memberId) {
    throw new BadRequestError('Member ID is required');
  }

  if (req.child && memberId !== req.child.memberId) {
    throw new ForbiddenError('Students can only access their own enrollments');
  }

  return memberId;
}

export class CourseController {
  static async getCourses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Accept both ageLevel and ageCategory (frontend CourseFilters uses ageCategory)
      const { category, ageLevel, ageCategory, search, page, limit } = req.query;
      
      const courses = await CourseService.getCourses({
        category: category as string,
        ageLevel: (ageLevel || ageCategory) as string,
        search: search as string,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      });
      
      res.json({
        success: true,
        data: courses,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { courseId } = req.params;
      const course = await CourseService.getCourse(courseId);
      
      res.json({
        success: true,
        data: course,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUnits(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { courseId } = req.params;
      const units = await CourseService.getUnits(courseId);
      
      res.json({
        success: true,
        data: units,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUnit(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { courseId, unitId } = req.params;
      const unit = await CourseService.getUnit(courseId, unitId);

      // Rewrite relative /coursebook-images/ paths to blob storage URLs
      // so images load directly from CDN without a redirect hop through the backend.
      if (unit.content?.text) {
        const blobBase = process.env.COURSEBOOK_IMAGES_BLOB_URL
          || 'https://stislamiclearning.blob.core.windows.net/coursebook-images';
        unit.content.text = unit.content.text.replace(
          /src="\/coursebook-images\//g,
          `src="${blobBase}/`
        );
      }

      res.json({
        success: true,
        data: unit,
      });
    } catch (error) {
      next(error);
    }
  }

  static async enrollMember(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { memberId, courseId } = req.body;
      const enrollment = await CourseService.enrollMember(req.user!.familyId, memberId, courseId);
      
      res.status(201).json({
        success: true,
        data: enrollment,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMemberEnrollments(req: ActiveMemberRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const memberId = resolveAccessibleMemberId(req, req.params.memberId);
      const familyId = resolveFamilyId(req);
      const enrollments = await CourseService.getMemberEnrollments(familyId, memberId);
      
      res.json({
        success: true,
        data: enrollments,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Simple enrollment via x-active-member-id header.
   * POST /api/v1/courses/:courseId/enroll
   * Idempotent: returns 200 with existing enrollment if already enrolled.
   */
  static async enrollActiveMember(req: ActiveMemberRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const memberId = resolveAccessibleMemberId(req);
      const familyId = resolveFamilyId(req);
      const { courseId } = req.params;

      const enrollment = await CourseService.enrollMemberIdempotent(familyId, memberId, courseId);

      res.status(200).json({
        success: true,
        data: enrollment,
      });
    } catch (error) {
      next(error);
    }
  }

  static async unenrollMember(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { enrollmentId } = req.params;
      await CourseService.unenrollMember(req.user!.familyId, enrollmentId);
      
      res.json({
        success: true,
        message: 'Unenrolled successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProgress(req: ActiveMemberRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { unitId, ...progressData } = req.body;
      const memberId = resolveAccessibleMemberId(req, req.body.memberId);
      const familyId = resolveFamilyId(req);
      const progress = await CourseService.updateProgress(familyId, memberId, unitId, progressData);
      
      res.json({
        success: true,
        data: progress,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMemberProgress(req: ActiveMemberRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const memberId = resolveAccessibleMemberId(req, req.params.memberId);
      const familyId = resolveFamilyId(req);
      const progress = await CourseService.getMemberProgress(familyId, memberId);
      
      res.json({
        success: true,
        data: progress,
      });
    } catch (error) {
      next(error);
    }
  }
}
