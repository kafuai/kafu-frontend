export interface Course {
  id: string;
  title: string;
  category: string;
  duration: number;
  active: boolean;
}

export function activateCourse(
  course: Course
): Course {
  return {
    ...course,
    active: true,
  };
}

export function isCourseActive(
  course: Course
): boolean {
  return course.active;
}
