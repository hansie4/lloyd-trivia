import {
  Avatar,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { useContext } from 'react';
import { CREAM, GameContext, GREEN } from '../../App';
import { adminNext } from '../../util/gateways';
import { Action } from '../../../../src/types/GameMove';

const ResultsScreen = () => {
  const { gameState, playerId } = useContext(GameContext);

  const isAdmin = gameState?.isAdmin;
  const question = gameState?.currentQuestion.question;

  let teamsToShow: {
    teamId: string;
    name: string;
    avatarId: string;
    score: number;
    sabatages: number;
  }[] = [];
  if (gameState?.teams) teamsToShow = gameState.teams;

  teamsToShow.sort((A, B) => B.score - A.score);

  const goToNextScreen = async () => {
    await adminNext(gameState?.gameId as string, playerId);
  };

  if (!isAdmin)
    return (
      <Card sx={{ backgroundColor: CREAM }}>
        <CardHeader title="Waiting on host..." />
      </Card>
    );

  return (
    <Card sx={{ backgroundColor: CREAM }}>
      {/* <CardMedia
        alt={question?.question}
        component="img"
        image={question?.photoPath}
        sx={{ maxWidth: '50vw' }}
      /> */}
      <CardHeader
        sx={{ textAlign: 'center' }}
        title={`${question?.correctAnswer} was the correct answer!`}
      />
      <Divider />
      <CardContent>
        <List>
          {teamsToShow.map((T, I) => {
            const action: Action = gameState?.actionQueue?.find(
              (A: Action | string) => (A as Action).teamName === T.name,
            ) as Action;

            return (
              <ListItem>
                <ListItemAvatar>
                  <Avatar>{I + 1}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={`${T.name}: ${T.score}`} />
                <ButtonGroup variant="contained" color="error">
                  {action.teamToSabatage && (
                    <Button>{action.teamToSabatage}</Button>
                  )}
                </ButtonGroup>
              </ListItem>
            );
          })}
        </List>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          fullWidth
          variant="contained"
          sx={{ backgroundColor: GREEN }}
          onClick={goToNextScreen}
        >
          Next
        </Button>
      </CardActions>
    </Card>
  );
};

export default ResultsScreen;
