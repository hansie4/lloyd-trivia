import { Box, CircularProgress } from '@mui/material';
import './App.css';
import { createContext } from 'react';
import useGameLoop, { UseGameLoop } from './util/useGameLoop';
import CreateAndJoinScreen from './screens/CreateAndJoinScreen/CreateAndJoinScreen';
import WaitingScreen from './screens/WaitingScreen/WaitingScreen';
import QuestionChoiceScreen from './screens/QuestionChoiceScreen/QuestionChoiceScreen';
import ResultsScreen from './screens/ResultsScreen/ResultsScreen';
import GameOverScreen from './screens/GameOverScreen/GameOverScreen';
import AnsweringScreen from './screens/AnsweringScreen/AnsweringScreen';

export const RED = '#da2c38';
export const GREEN = '#226f54';
export const LIGHT_GREEN = '#87c38f';
export const CREAM = '#f4f0bb';
export const BROWN = '#43291f';

export const GameContext = createContext<UseGameLoop>({
  showJoinOrCreateScreen: false,
  loading: true,
  gameState: undefined,
  activeGames: [],
  loadGames: () => {},
  joinGame: () => {},
  createGame: () => {},
  playerId: '',
  subscribeToEventSource: () => {},
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
          rejoinGame={game.subscribeToEventSource}
        />
      );
    if (game.gameState?.state === 'WAITING') return <WaitingScreen />;
    if (game.gameState?.state === 'PICKING_QUESTION')
      return <QuestionChoiceScreen />;
    if (game.gameState?.state === 'ANSWERING') return <AnsweringScreen />;
    if (game.gameState?.state === 'RESULTS') return <ResultsScreen />;
    if (game.gameState?.state === 'OVER') return <GameOverScreen />;
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
        overflow={'hidden'}
      >
        <Box padding={1}>{getView()}</Box>
      </Box>
    </GameContext.Provider>
  );
}

export default App;
