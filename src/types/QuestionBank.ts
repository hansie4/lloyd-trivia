export interface QuestionBank {
  categories: Question[];
}

export interface Catergory {
  catId: string;
  title: string;
  '200': Question;
  '400': Question;
  '600': Question;
  '800': Question;
  '1000': Question;
}

export interface Question {
  type: QuestionType;
  question: string;
  correctAnswer: boolean | string;
  photoPath: string;
  dailyDouble: boolean;
  options?: string[];
  complete?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const QuestionTypeOptions: string[] = [
  'TRUE_FALSE',
  'MULTIPLE_CHOICE',
  'FILL_IN_THE_BLANK',
];
export type QuestionType = (typeof QuestionTypeOptions)[number];
