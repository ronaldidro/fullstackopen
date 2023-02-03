interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartBaseTwo extends CoursePartBase {
  description: string;
}

interface CoursePartOne extends CoursePartBaseTwo {
  name: "Fundamentals";
}

interface CoursePartTwo extends CoursePartBase {
  name: "Using props to pass data";
  groupProjectCount: number;
}

interface CoursePartThree extends CoursePartBaseTwo {
  name: "Deeper type usage";
  exerciseSubmissionLink: string;
}

interface CoursePartFour extends CoursePartBaseTwo {
  name: "Learning with Full Stack Open";
  modulesCompleted: number;
}

export type CoursePart =
  | CoursePartOne
  | CoursePartTwo
  | CoursePartThree
  | CoursePartFour;
