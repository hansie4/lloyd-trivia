import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid2,
  Typography,
} from '@mui/material';
import { useContext } from 'react';
import { CREAM, GameContext, GREEN } from '../../App';
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
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
      }}
    >
      <Box padding={1}>
        <Card sx={{ backgroundColor: CREAM }}>
          <CardHeader title={`${currentTeam?.name} is picking!`} />
          <Divider />
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
            <>
              <Divider />
              <CardActions>
                <Button
                  disabled={!canGoNextScreen}
                  sx={{ backgroundColor: GREEN }}
                  onClick={adminClicksNext}
                  fullWidth
                  variant="contained"
                >
                  Next
                </Button>
              </CardActions>
            </>
          )}
        </Card>
      </Box>
    </Box>
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
    <Grid2 container columns={6} spacing={1}>
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
            spacing={1}
          >
            <Grid2 size={1}>
              <Typography textAlign={'center'}>{C.title}</Typography>
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
                fullWidth
                variant="contained"
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
                fullWidth
                variant="contained"
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
                fullWidth
                variant="contained"
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
                fullWidth
                variant="contained"
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
                fullWidth
                variant="contained"
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
