import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useContext, useState } from 'react';
import { GameContext, GREEN } from '../../App';
import { Question } from '../../../../src/types/QuestionBank';
import StarIcon from '@mui/icons-material/Star';
import { Action } from '../../../../src/types/GameMove';
import { adminReveal, playerAnswerQuestion } from '../../util/gateways';

const AnsweringScreen = () => {
  const { gameState, playerId } = useContext(GameContext);

  const question = gameState?.currentQuestion?.question;

  const isAdmin = Boolean(gameState?.isAdmin);
  const canGoNextScreen = Boolean(gameState?.readyForNextState);

  const teams = gameState?.teams ? gameState.teams : [];
  const currentTeam = gameState?.teams.find((T) => Boolean(T.teamId));
  //const sabatages = currentTeam ? currentTeam.sabatages : 0;

  const [doneAnswering, setDoneAnswering] = useState(
    Boolean(
      currentTeam?.name &&
        (gameState?.actionQueue as string[])?.includes(currentTeam.name),
    ),
  );
  const [answer, setAnswer] = useState<string | boolean | null>(null);
  const [teamToSabatage, setTeamToSabatage] = useState('');

  const submitAnswer = async () => {
    const action: Action = {
      teamId: playerId,
      teamName: currentTeam?.name as string,
      answer:
        question?.type === 'TRUE_FALSE'
          ? answer === 'true'
          : (answer as string).toLowerCase(),
      teamToSabatage: teamToSabatage,
    };

    await playerAnswerQuestion(gameState?.gameId as string, playerId, action);

    setDoneAnswering(true);
  };

  const revealResults = async () => {
    await adminReveal(gameState?.gameId as string, playerId);
  };

  if (isAdmin && question)
    return (
      <AdminViewShowQuestion
        question={question}
        canGoNextScreen={canGoNextScreen}
        revealResults={revealResults}
      />
    );

  if (question?.type === 'FILL_IN_THE_BLANK')
    return (
      <FillInTheBlankQuestionCard
        question={question}
        teams={teams}
        sabatages={0}
        teamToSabatage={teamToSabatage}
        setTeamToSabatage={setTeamToSabatage}
        answer={answer}
        setAnswer={setAnswer}
        doneAnswering={doneAnswering}
        submitAnswer={submitAnswer}
        currentTeam={currentTeam?.name as string}
      />
    );
  if (question?.type === 'MULTIPLE_CHOICE')
    return (
      <MultipleChoiceQuestionCard
        question={question}
        teams={teams}
        sabatages={0}
        teamToSabatage={teamToSabatage}
        setTeamToSabatage={setTeamToSabatage}
        answer={answer}
        setAnswer={setAnswer}
        doneAnswering={doneAnswering}
        submitAnswer={submitAnswer}
        currentTeam={currentTeam?.name as string}
      />
    );
  if (question?.type === 'TRUE_FALSE')
    return (
      <TrueOrFalseQuestionCard
        question={question}
        teams={teams}
        sabatages={0}
        teamToSabatage={teamToSabatage}
        setTeamToSabatage={setTeamToSabatage}
        answer={answer}
        setAnswer={setAnswer}
        doneAnswering={doneAnswering}
        submitAnswer={submitAnswer}
        currentTeam={currentTeam?.name as string}
      />
    );

  return null;
};

export default AnsweringScreen;

export const AdminViewShowQuestion = ({
  question,
  canGoNextScreen,
  revealResults,
}: {
  question: Question;
  canGoNextScreen: boolean;
  revealResults: () => void;
}) => {
  return (
    <Card>
      {/* <CardMedia
        alt={question.question}
        component="img"
        image={question.photoPath}
        sx={{ maxWidth: '70vw' }}
      /> */}
      <CardHeader title="Question: " />
      <Divider />
      <CardContent>
        <Typography variant="h2">
          {
            <>
              {question.dailyDouble ? (
                <StarIcon sx={{ marginRight: 2 }} />
              ) : null}
              {question.question}
            </>
          }
        </Typography>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          fullWidth
          variant="contained"
          disabled={!canGoNextScreen}
          sx={{ backgroundColor: GREEN }}
          onClick={revealResults}
        >
          Reveal results
        </Button>
      </CardActions>
    </Card>
  );
};

export const FillInTheBlankQuestionCard = ({
  question,
  answer,
  setAnswer,
  doneAnswering,
  submitAnswer,
  teams,
  sabatages,
  teamToSabatage,
  setTeamToSabatage,
  currentTeam,
}: {
  question: Question;
  answer: boolean | string | null;
  setAnswer: (e: boolean | string | null) => void;
  doneAnswering: boolean;
  submitAnswer: () => void;
  teams: any[];
  sabatages: number;
  teamToSabatage: string;
  setTeamToSabatage: (s: string) => void;
  currentTeam: string;
}) => {
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
      <Divider />
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
          disabled={!answer || doneAnswering}
          onClick={submitAnswer}
        >
          Submit
        </Button>
      </CardActions>
      {sabatages > 0 && (
        <>
          <Divider />
          <CardContent>
            <SabatageMenu
              teams={teams}
              sabatages={sabatages}
              teamToSabatage={teamToSabatage}
              setTeamToSabatage={setTeamToSabatage}
              doneAnswering={doneAnswering}
              currentTeam={currentTeam}
            />
          </CardContent>
        </>
      )}
    </Card>
  );
};

export const TrueOrFalseQuestionCard = ({
  question,
  answer,
  setAnswer,
  doneAnswering,
  submitAnswer,
  teams,
  sabatages,
  teamToSabatage,
  setTeamToSabatage,
  currentTeam,
}: {
  question: Question;
  answer: boolean | string | null;
  setAnswer: (e: boolean | string | null) => void;
  doneAnswering: boolean;
  submitAnswer: () => void;
  teams: any[];
  sabatages: number;
  teamToSabatage: string;
  setTeamToSabatage: (s: string) => void;
  currentTeam: string;
}) => {
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
      <Divider />
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
          disabled={answer === null || doneAnswering}
          onClick={submitAnswer}
        >
          Submit
        </Button>
      </CardActions>
      {sabatages > 0 && (
        <>
          <Divider />
          <CardContent>
            <SabatageMenu
              teams={teams}
              sabatages={sabatages}
              teamToSabatage={teamToSabatage}
              setTeamToSabatage={setTeamToSabatage}
              doneAnswering={doneAnswering}
              currentTeam={currentTeam}
            />
          </CardContent>
        </>
      )}
    </Card>
  );
};

export const MultipleChoiceQuestionCard = ({
  question,
  answer,
  setAnswer,
  doneAnswering,
  submitAnswer,
  teams,
  sabatages,
  teamToSabatage,
  setTeamToSabatage,
  currentTeam,
}: {
  question: Question;
  answer: boolean | string | null;
  setAnswer: (e: boolean | string | null) => void;
  doneAnswering: boolean;
  submitAnswer: () => void;
  teams: any[];
  sabatages: number;
  teamToSabatage: string;
  setTeamToSabatage: (s: string) => void;
  currentTeam: string;
}) => {
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
      <Divider />
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
          disabled={answer === null || doneAnswering}
          onClick={submitAnswer}
        >
          Submit
        </Button>
      </CardActions>
      {sabatages > 0 && (
        <>
          <Divider />
          <CardContent>
            <SabatageMenu
              teams={teams}
              sabatages={sabatages}
              teamToSabatage={teamToSabatage}
              setTeamToSabatage={setTeamToSabatage}
              doneAnswering={doneAnswering}
              currentTeam={currentTeam}
            />
          </CardContent>
        </>
      )}
    </Card>
  );
};

export const SabatageMenu = ({
  currentTeam,
  teams,
  sabatages,
  teamToSabatage,
  setTeamToSabatage,
  doneAnswering,
}: {
  currentTeam: string;
  teams: any[];
  sabatages: number;
  teamToSabatage: string;
  setTeamToSabatage: (s: string) => void;
  doneAnswering: boolean;
}) => {
  return (
    <Stack spacing={1}>
      <Typography>Sabatages: {sabatages}</Typography>
      <ToggleButtonGroup
        fullWidth
        color="error"
        disabled={sabatages === 0 || doneAnswering}
        value={teamToSabatage}
        exclusive
        onChange={(_, team) => setTeamToSabatage(team)}
      >
        {teams?.map((T: any, I: number) => {
          if (T.name === currentTeam) return null;
          return (
            <ToggleButton value={T.name} key={I}>
              {T.name}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </Stack>
  );
};
