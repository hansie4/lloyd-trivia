import { Container, Box } from '@mui/material';
import { useContext } from 'react';
import { GameContext } from '../../App';

export interface UIQuestion {
  value: number;
  type: string;
  question: string;
  photoPath: string;
  dailyDouble: boolean;
  options?: string[];
  correctAnswer?: string;
}

const AnswerChoiceScreen = () => {
  const { gameState, playerId } = useContext(GameContext);

  return (
    <Container>
      <Box padding={2}>
        <h1>ANSWER CHOICE</h1>
        <h2>{JSON.stringify(gameState?.currentQuestion?.question)}</h2>
      </Box>
    </Container>
  );
};

export default AnswerChoiceScreen;
