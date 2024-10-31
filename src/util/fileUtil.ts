import { QuestionBank } from 'src/types/QuestionBank';
import { readFileSync } from 'fs';
import { join } from 'path';

export const loadQuestionBank = (): QuestionBank => {
  const qb: QuestionBank = JSON.parse(
    readFileSync(join(__dirname, '..', '..', 'question-bank.json'), 'utf8'),
  );

  return qb;
};
