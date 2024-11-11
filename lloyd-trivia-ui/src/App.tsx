import { Box } from '@mui/material';
import './App.css';
import { createContext } from 'react';
import useGameLoop from './util/useGameLoop';
import CreateAndJoinScreen from './screens/CreateAndJoinScreen/CreateAndJoinScreen';

const GameContext = createContext<{
  loading: boolean;
  isAdmin: boolean | undefined;
  gameId: string | null;
  playerId: string | null;
  gameState: unknown;
}>({
  loading: false,
  isAdmin: undefined,
  gameId: null,
  playerId: null,
  gameState: null,
});

function App() {
  const {
    loading,
    gameId,
    playerId,
    gameState,
    activeGames,
    loadGames,
    joinGame,
    createGame,
  } = useGameLoop();

  return (
    <GameContext.Provider
      value={{
        loading: loading,
        isAdmin: false,
        gameId: '',
        playerId: '',
        gameState: null,
      }}
    >
      <Box
        width={'100vw'}
        height={'100vh'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        {!gameId || !playerId ? (
          <CreateAndJoinScreen
            activeGames={activeGames}
            loadGames={loadGames}
            joinGame={joinGame}
            createGame={createGame}
          />
        ) : null}
        <h1>{JSON.stringify(gameState)}</h1>
      </Box>
    </GameContext.Provider>
  );
}

export default App;
