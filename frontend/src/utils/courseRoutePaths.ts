export function isChildCoursePath(pathname: string) {
  return pathname.startsWith('/child/');
}

export function getCourseRoutePrefix(pathname: string) {
  return isChildCoursePath(pathname) ? '/child/courses' : '/courses';
}

export function getCourseLearnPath(pathname: string, courseId: string) {
  return `${getCourseRoutePrefix(pathname)}/${courseId}/learn`;
}

export function getUnitPath(pathname: string, courseId: string, unitId: string) {
  return `${getCourseRoutePrefix(pathname)}/${courseId}/units/${unitId}`;
}

export function getQuizPath(pathname: string, courseId: string, unitId: string) {
  return `${getUnitPath(pathname, courseId, unitId)}/quiz`;
}
