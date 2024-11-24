import { useState } from 'react';

const useCreateAndJoinScreen = () => {
  const [gameIdInput, setGameIdInput] = useState('');
  const [teamNameInput, setTeamNameInput] = useState('');

  const handleGameIdChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setGameIdInput(e.target.value);
  };

  const handleTeamNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setTeamNameInput(e.target.value);
  };

  return {
    gameIdInput,
    teamNameInput,
    handleGameIdChange,
    handleTeamNameChange,
    disableCreate: !gameIdInput,
    disableJoin: !teamNameInput,
  };
};

export default useCreateAndJoinScreen;
