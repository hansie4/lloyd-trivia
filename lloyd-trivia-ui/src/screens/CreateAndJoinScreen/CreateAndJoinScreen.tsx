import {
  Container,
  Paper,
  Box,
  Stack,
  TextField,
  ButtonGroup,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  IconButton,
} from '@mui/material';
import useCreateAndJoinScreen from './useCreateAndJoinScreen';
import RefreshIcon from '@mui/icons-material/Refresh';

const CreateAndJoinScreen = ({
  activeGames,
  loadGames,
  joinGame,
  createGame,
}: {
  activeGames: string[];
  loadGames: () => void;
  joinGame: (gameId: string, teamName: string, avatarId: string) => void;
  createGame: (gameId: string) => void;
}) => {
  const {
    gameIdInput,
    teamNameInput,
    handleGameIdChange,
    handleTeamNameChange,
    disableCreate,
    disableJoin,
  } = useCreateAndJoinScreen();

  return (
    <Container maxWidth={'xs'}>
      <Paper square={false} elevation={24}>
        <Box padding={2}>
          <Stack spacing={2}>
            <Typography variant="h5">
              <IconButton onClick={loadGames}>
                <RefreshIcon />
              </IconButton>{' '}
              Click to join an existing game or create on below:
            </Typography>
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
                        disabled={disableJoin}
                        onClick={() => joinGame(AG, teamNameInput, 'TODO')}
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
            <hr />
            <TextField
              variant="outlined"
              label="Game ID"
              size="small"
              fullWidth
              value={gameIdInput}
              onChange={handleGameIdChange}
            />
            <ButtonGroup variant="contained" fullWidth>
              <Button
                onClick={() => createGame(gameIdInput)}
                disabled={disableCreate}
              >
                Create game
              </Button>
            </ButtonGroup>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateAndJoinScreen;
