import { Box, CircularProgress } from '@mui/material';
import './App.css';
import { createContext } from 'react';
import useGameLoop from './util/useGameLoop';
import CreateAndJoinScreen from './screens/CreateAndJoinScreen/CreateAndJoinScreen';
import WaitingScreen from './screens/WaitingScreen/WaitingScreen';
import { GameState } from '../../src/types/GameState';

export const GameContext = createContext<{
  showJoinOrCreateScreen: boolean;
  loading: boolean;
  gameState: GameState | undefined;
  activeGames: string[];
  loadGames: () => void;
  joinGame: (gameId: string, teamName: string, avatarId: string) => void;
  createGame: (gameId: string) => void;
}>({
  showJoinOrCreateScreen: false,
  loading: true,
  gameState: undefined,
  activeGames: [],
  loadGames: () => {},
  joinGame: () => {},
  createGame: () => {},
});

function App() {
  const game = useGameLoop();

  const getView = () => {
    if (game.loading) return <CircularProgress variant="indeterminate" />;
    if (game.showJoinOrCreateScreen)
      return (
        <CreateAndJoinScreen
          activeGames={game.activeGames}
          loadGames={game.loadGames}
          joinGame={game.joinGame}
          createGame={game.createGame}
        />
      );
    if (game.gameState?.state === 'WAITING') return <WaitingScreen />;

    return null;
  };

  return (
    <GameContext.Provider value={game}>
      <Box
        width={'100vw'}
        height={'100vh'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        {getView()}
      </Box>
    </GameContext.Provider>
  );
}

export default App;
