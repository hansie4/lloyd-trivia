import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useContext } from 'react';
import { BROWN, CREAM, GameContext, LIGHT_GREEN, RED } from '../../App';
import { adminStart } from '../../util/gateways';

const WaitingScreen = () => {
  const { gameState } = useContext(GameContext);

  const isAdmin = gameState?.isAdmin;
  const teamList = gameState?.teams;

  const canGoNextScreen = gameState?.readyForNextState;

  return (
    <Card sx={{ backgroundColor: CREAM }}>
      <CardHeader title="Waiting for teams to join..." />
      <Divider />
      <CardContent>
        <List>
          {teamList?.map((T) => {
            return (
              <ListItem
                key={T.name}
                sx={{
                  backgroundColor: LIGHT_GREEN,
                  border: '3px solid',
                  borderRadius: '8px',
                  borderColor: BROWN,
                }}
              >
                <ListItemIcon>
                  <Avatar />
                </ListItemIcon>
                <ListItemText>{T.name}</ListItemText>
              </ListItem>
            );
          })}
        </List>
      </CardContent>
      {isAdmin && (
        <>
          <Divider />
          <CardActions>
            <Button
              onClick={() =>
                adminStart(gameState.gameId, gameState.adminId as string)
              }
              disabled={!canGoNextScreen}
              fullWidth
              variant="contained"
              sx={{ backgroundColor: RED }}
            >
              Start game
            </Button>
          </CardActions>
        </>
      )}
    </Card>
  );
};

export default WaitingScreen;
