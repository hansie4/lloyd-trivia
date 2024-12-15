import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useContext, useState } from 'react';
import { GameContext } from '../../App';
import { Question } from '../../../../src/types/QuestionBank';
import StarIcon from '@mui/icons-material/Star';

const AnsweringScreen = () => {
  const { gameState, playerId } = useContext(GameContext);

  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [teamToSabatage, setTeamToSabatage] = useState(null);

  const question = gameState?.currentQuestion?.question;

  const isAdmin = Boolean(gameState?.isAdmin);
  const canGoNextScreen = Boolean(gameState?.readyForNextState);

  const teams = gameState?.teams ? gameState.teams : [];
  const currentTeam = gameState?.teams.find((T) => Boolean(T.teamId));
  const sabatages = currentTeam ? currentTeam.sabatages : 0;

  if (isAdmin && question)
    return (
      <AdminViewShowQuestion
        question={question}
        canGoNextScreen={canGoNextScreen}
      />
    );

  if (question?.type === 'FILL_IN_THE_BLANK')
    return (
      <FillInTheBlankQuestionCard
        question={question}
        answerSubmitted={answerSubmitted}
        teams={teams}
        sabatages={sabatages}
      />
    );
  if (question?.type === 'MULTIPLE_CHOICE')
    return (
      <MultipleChoiceQuestionCard
        question={question}
        answerSubmitted={answerSubmitted}
        teams={teams}
        sabatages={sabatages}
      />
    );
  if (question?.type === 'TRUE_FALSE')
    return (
      <TrueOrFalseQuestionCard
        question={question}
        answerSubmitted={answerSubmitted}
        teams={teams}
        sabatages={sabatages}
      />
    );

  return null;
};

export default AnsweringScreen;

export const AdminViewShowQuestion = ({
  question,
  canGoNextScreen,
}: {
  question: Question;
  canGoNextScreen: boolean;
}) => {
  return (
    <Card>
      <CardMedia
        alt={question.question}
        component="img"
        image={question.photoPath}
        sx={{ maxWidth: '70vw' }}
      />
      <CardHeader
        title={
          <>
            {question.dailyDouble ? <StarIcon sx={{ marginRight: 2 }} /> : null}
            {question.question}
          </>
        }
      />
      <CardActions>
        <Button fullWidth variant="contained" disabled={!canGoNextScreen}>
          Reveal results
        </Button>
      </CardActions>
    </Card>
  );
};

export const FillInTheBlankQuestionCard = ({
  question,
  answerSubmitted,
  teams,
  sabatages,
}: {
  question: Question;
  answerSubmitted: boolean;
  teams: any[];
  sabatages: number;
}) => {
  const [answer, setAnswer] = useState('');

  return (
    <Card>
      <CardHeader
        title={
          <>
            {question.dailyDouble ? <StarIcon sx={{ marginRight: 2 }} /> : null}
            {question.question}
          </>
        }
      />
      <CardContent>
        <TextField
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Your answer"
          fullWidth
        />
      </CardContent>
      <CardActions>
        <Button
          fullWidth
          variant="contained"
          disabled={!answer || answerSubmitted}
        >
          Submit
        </Button>
      </CardActions>
      {true && (
        <CardContent>
          <SabatageMenu teams={teams} sabatages={sabatages} />
        </CardContent>
      )}
    </Card>
  );
};

export const TrueOrFalseQuestionCard = ({
  question,
  answerSubmitted,
  teams,
  sabatages,
}: {
  question: Question;
  answerSubmitted: boolean;
  teams: any[];
  sabatages: number;
}) => {
  const [answer, setAnswer] = useState(null);

  return (
    <Card>
      <CardHeader
        title={
          <>
            {question.dailyDouble ? <StarIcon sx={{ marginRight: 2 }} /> : null}
            {question.question}
          </>
        }
      />
      <CardContent>
        <ToggleButtonGroup
          exclusive
          onChange={(_, v) => setAnswer(v)}
          fullWidth
        >
          <ToggleButton value="true">True</ToggleButton>
          <ToggleButton value="false">False</ToggleButton>
        </ToggleButtonGroup>
      </CardContent>
      <CardActions>
        <Button
          fullWidth
          variant="contained"
          disabled={answer === null || answerSubmitted}
        >
          Submit
        </Button>
      </CardActions>
      {true && (
        <CardContent>
          <SabatageMenu teams={teams} sabatages={sabatages} />
        </CardContent>
      )}
    </Card>
  );
};

export const MultipleChoiceQuestionCard = ({
  question,
  answerSubmitted,
  teams,
  sabatages,
}: {
  question: Question;
  answerSubmitted: boolean;
  teams: any[];
  sabatages: number;
}) => {
  const [answer, setAnswer] = useState(null);

  return (
    <Card>
      <CardHeader
        title={
          <>
            {question.dailyDouble ? <StarIcon sx={{ marginRight: 2 }} /> : null}
            {question.question}
          </>
        }
      />
      <CardContent>
        <ToggleButtonGroup exclusive onChange={(_, v) => setAnswer(v)}>
          {question.options?.map((QO, I) => {
            return (
              <ToggleButton key={I} value={QO}>
                {QO}
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      </CardContent>
      <CardActions>
        <Button
          fullWidth
          variant="contained"
          disabled={answer === null || answerSubmitted}
        >
          Submit
        </Button>
      </CardActions>
      {true && (
        <CardContent>
          <SabatageMenu teams={teams} sabatages={sabatages} />
        </CardContent>
      )}
    </Card>
  );
};

export const SabatageMenu = ({
  teams,
  sabatages,
}: {
  teams: any[];
  sabatages: number;
}) => {
  return (
    <Stack spacing={1}>
      <Typography>Sabatages: {sabatages}</Typography>
      {teams?.map((T: any, I: number) => {
        return (
          <Button
            key={I}
            fullWidth
            variant="contained"
            color="error"
            disabled={sabatages === 0}
          >
            {T.name}
          </Button>
        );
      })}
    </Stack>
  );
};
