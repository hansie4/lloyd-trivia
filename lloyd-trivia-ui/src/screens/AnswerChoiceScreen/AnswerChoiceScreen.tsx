import { Star } from '@mui/icons-material';
import { Container, Box, Card, CardHeader, CardMedia } from '@mui/material';
import AnswerChoicesAdmin from './AnswerChoicesAdmin';
import AnswerChoicesPlayer from './AnswerChoicesPlayer';

export interface UIQuestion {
  value: number;
  type: string;
  question: string;
  photoPath: string;
  dailyDouble: boolean;
  options?: string[];
  correctAnswer?: string;
}

const AnswerChoiceScreen = ({
  question,
  isAdmin,
}: {
  question: UIQuestion;
  isAdmin: boolean;
}) => {
  return (
    <Container>
      <Box padding={2}>
        <Card>
          <CardHeader
            title={`(${question.value}) - ${question.question}`}
            action={
              question.dailyDouble ? (
                <Star fontSize="large" color="warning" />
              ) : undefined
            }
          />
          <CardMedia
            component="img"
            height="194"
            alt={`img for question: ${question.question}`}
            src={question.photoPath}
          />
          {isAdmin ? (
            <AnswerChoicesAdmin question={question} />
          ) : (
            <AnswerChoicesPlayer
              question={question}
              selectAnswer={(a) => console.log(a)}
              disabled={false}
            />
          )}
        </Card>
      </Box>
    </Container>
  );
};

export default AnswerChoiceScreen;
