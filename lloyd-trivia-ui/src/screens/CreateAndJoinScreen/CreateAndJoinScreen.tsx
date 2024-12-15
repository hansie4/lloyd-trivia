import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
} from '@mui/material';
import useCreateAndJoinScreen from './useCreateAndJoinScreen';
import { CREAM, GREEN, LIGHT_GREEN, RED } from '../../App';

const CreateAndJoinScreen = ({
  activeGames,
  joinGame,
  createGame,
  rejoinGame,
}: {
  activeGames: string[];
  loadGames: () => void;
  joinGame: (gameId: string, teamName: string, avatarId: string) => void;
  createGame: (gameId: string) => void;
  rejoinGame: (gameId: string, playerId: string) => void;
}) => {
  const {
    gameIdInput,
    teamNameInput,
    handleGameIdChange,
    handleTeamNameChange,
    disableCreate,
    disableJoin,
    inMemoryGameId,
    inMemoryPlayerId,
  } = useCreateAndJoinScreen();

  return (
    <Card sx={{ backgroundColor: CREAM }}>
      <CardHeader title="Lloyd Trivia!!!" />
      <Divider />
      <CardContent>
        <TextField
          variant="outlined"
          label="Team Name"
          size="small"
          fullWidth
          value={teamNameInput}
          onChange={handleTeamNameChange}
        />
        <List>
          {activeGames.length ? (
            activeGames.map((AG, I) => {
              return (
                <ListItem disablePadding key={I}>
                  <ListItemButton
                    sx={{
                      backgroundColor: LIGHT_GREEN,
                      border: '3px solid',
                      borderRadius: '8px',
                      borderColor: RED,
                    }}
                    disabled={
                      AG === inMemoryGameId && inMemoryPlayerId
                        ? false
                        : disableJoin
                    }
                    onClick={() => {
                      if (AG === inMemoryGameId && inMemoryPlayerId) {
                        rejoinGame(inMemoryGameId, inMemoryPlayerId);
                      } else {
                        joinGame(AG, teamNameInput, 'TODO');
                      }
                    }}
                  >
                    <ListItemText>{AG}</ListItemText>
                  </ListItemButton>
                </ListItem>
              );
            })
          ) : (
            <ListItem disablePadding>
              <ListItemText>No active games currently</ListItemText>
            </ListItem>
          )}
        </List>
      </CardContent>
      <Divider />
      <CardContent>
        <TextField
          variant="outlined"
          label="Game ID"
          size="small"
          fullWidth
          value={gameIdInput}
          onChange={handleGameIdChange}
        />
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          fullWidth
          onClick={() => createGame(gameIdInput)}
          disabled={disableCreate}
          sx={{ backgroundColor: GREEN }}
        >
          Create game
        </Button>
      </CardActions>
    </Card>
  );
};

export default CreateAndJoinScreen;
