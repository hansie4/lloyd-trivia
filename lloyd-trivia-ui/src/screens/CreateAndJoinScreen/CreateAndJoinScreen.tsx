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
import { GameState } from '../../../../src/types/GameState';
import useCreateAndJoinScreen from './useCreateAndJoinScreen';
import RefreshIcon from '@mui/icons-material/Refresh';

const CreateAndJoinScreen = ({
  activeGames,
  loadGames,
  joinGame,
  createGame,
}: {
  activeGames: GameState[];
  loadGames: () => void;
  joinGame: (gameId: string) => void;
  createGame: (gameId: string) => void;
}) => {
  const { gameIdInput, handleGameIdChange, createNewGame, disableCreate } =
    useCreateAndJoinScreen(createGame);

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
            <List>
              {activeGames.length ? (
                activeGames.map((AG, I) => {
                  return (
                    <ListItem disablePadding key={I}>
                      <ListItemButton onClick={() => joinGame(AG.gameId)}>
                        <ListItemText>{AG.gameId}</ListItemText>
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
              <Button onClick={createNewGame} disabled={disableCreate}>
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
