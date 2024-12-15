import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid2,
  Typography,
} from '@mui/material';
import { useContext } from 'react';
import { GameContext } from '../../App';
import { QuestionBank } from '../../../../src/types/QuestionBank';
import { adminShow, playerPickQuestion } from '../../util/gateways';

const QuestionChoiceScreen = () => {
  const { gameState, playerId } = useContext(GameContext);

  const questionBank = gameState?.questionBank;
  const currentTeam = gameState?.teams[gameState.currentTeamTurn];

  const isAdmin = Boolean(gameState?.isAdmin);
  const amIChoosing = currentTeam?.teamId === playerId;

  const selectedQuestion = gameState?.currentQuestion?.question?.question;

  const canGoNextScreen = Boolean(gameState?.readyForNextState);

  const adminClicksNext = () => {
    if (gameState?.gameId && playerId) {
      adminShow(gameState?.gameId, playerId);
    }
  };

  const playerClicksQuestion = (catId: string, questionValue: number) => {
    if (gameState?.gameId && playerId) {
      playerPickQuestion(gameState.gameId, playerId, catId, questionValue);
    }
  };

  return (
    <Card>
      <CardHeader title={`${currentTeam?.name} is picking the next question`} />
      <CardContent>
        {questionBank && (
          <QuestionGrid
            questionBank={questionBank}
            disabled={!amIChoosing || isAdmin || Boolean(selectedQuestion)}
            onQuestionSelected={playerClicksQuestion}
            selectedQuestion={selectedQuestion as string}
          />
        )}
      </CardContent>
      {isAdmin && (
        <CardActions>
          <Button
            disabled={!canGoNextScreen}
            color="info"
            onClick={adminClicksNext}
          >
            Next
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default QuestionChoiceScreen;

const QuestionGrid = ({
  questionBank,
  disabled,
  onQuestionSelected,
  selectedQuestion,
}: {
  questionBank: QuestionBank;
  disabled: boolean;
  onQuestionSelected: (catId: string, questionValue: number) => void;
  selectedQuestion: string;
}) => {
  const categories = questionBank.categories;

  return (
    <Grid2 container columns={categories.length * 3}>
      {categories.map((C, I) => {
        const is200Selected = selectedQuestion === C[200].question;
        const is400Selected = selectedQuestion === C[400].question;
        const is600Selected = selectedQuestion === C[600].question;
        const is800Selected = selectedQuestion === C[800].question;
        const is1000Selected = selectedQuestion === C[1000].question;

        const is200Complete = C[200].complete;
        const is400Complete = C[400].complete;
        const is600Complete = C[600].complete;
        const is800Complete = C[800].complete;
        const is1000Complete = C[1000].complete;

        const is200Disabled = is200Complete || disabled;
        const is400Disabled = is400Complete || disabled;
        const is600Disabled = is600Complete || disabled;
        const is800Disabled = is800Complete || disabled;
        const is1000Disabled = is1000Complete || disabled;

        return (
          <Grid2
            container
            size={3}
            columns={1}
            key={I}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Grid2 size={1}>
              <Typography>{C.title}</Typography>
            </Grid2>
            <Grid2 size={1}>
              <Button
                disabled={is200Disabled && !is200Selected}
                color={
                  is200Selected
                    ? 'info'
                    : is200Complete
                      ? 'secondary'
                      : 'success'
                }
                onClick={() =>
                  is200Selected ? {} : onQuestionSelected(C.catId, 200)
                }
              >
                200
              </Button>
            </Grid2>
            <Grid2 size={1}>
              <Button
                disabled={is400Disabled && !is400Selected}
                color={
                  is400Selected
                    ? 'info'
                    : is400Complete
                      ? 'secondary'
                      : 'success'
                }
                onClick={() => onQuestionSelected(C.catId, 400)}
              >
                400
              </Button>
            </Grid2>
            <Grid2 size={1}>
              <Button
                disabled={is600Disabled && !is600Selected}
                color={
                  is600Selected
                    ? 'info'
                    : is600Complete
                      ? 'secondary'
                      : 'success'
                }
                onClick={() => onQuestionSelected(C.catId, 600)}
              >
                600
              </Button>
            </Grid2>
            <Grid2 size={1}>
              <Button
                disabled={is800Disabled && !is800Selected}
                color={
                  is800Selected
                    ? 'info'
                    : is800Complete
                      ? 'secondary'
                      : 'success'
                }
                onClick={() => onQuestionSelected(C.catId, 800)}
              >
                800
              </Button>
            </Grid2>
            <Grid2 size={1}>
              <Button
                disabled={is1000Disabled && !is1000Selected}
                color={
                  is1000Selected
                    ? 'info'
                    : is1000Complete
                      ? 'secondary'
                      : 'success'
                }
                onClick={() => onQuestionSelected(C.catId, 1000)}
              >
                1000
              </Button>
            </Grid2>
          </Grid2>
        );
      })}
    </Grid2>
  );
};
