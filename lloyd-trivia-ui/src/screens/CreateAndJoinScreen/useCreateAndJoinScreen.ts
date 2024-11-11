import { useState } from 'react';

const useCreateAndJoinScreen = (createGame: (gameId: string) => void) => {
  const [gameIdInput, setGameIdInput] = useState('');

  const handleGameIdChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setGameIdInput(e.target.value);
  };

  const createNewGame = () => {
    if (gameIdInput) createGame(gameIdInput);
  };

  return {
    gameIdInput,
    handleGameIdChange,
    createNewGame,
    disableCreate: !gameIdInput,
  };
};

export default useCreateAndJoinScreen;
