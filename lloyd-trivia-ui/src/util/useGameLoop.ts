import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { GAME_STATE_UPDATE_ENDPOINT, JOIN_GAME_ENDPOINT } from '../constants';
import { GameState } from '../../../src/types/GameState';

const useGameLoop = () => {
  const [loading, setLoading] = useState(false);
  const [activeGames, setActiveGames] = useState<GameState[]>([]);
  const [gameId, setGameId] = useState<string | null>();
  const [playerId, setPlayerId] = useState<string | null>();
  const [gameState, setGameState] = useState<GameState>();

  const loadGames = useCallback(async () => {
    console.log('Fetching games');
    setLoading(true);
    try {
      const games = (await axios.get(GAME_STATE_UPDATE_ENDPOINT)).data;
      setActiveGames(games);
    } catch (error) {
      console.log(error);
      setActiveGames([]);
    }
    setLoading(false);
  }, []);

  const joinGame = async (gameId: string) => {
    console.log('Joining game: ', gameId);
    try {
        await axios.
    } catch (error) {
        console.log(error)
    }
  };

  const createGame = async (gameId: string) => {
    console.log('Creating game: ', gameId);
  };

  useEffect(() => {
    let eventSource = null;

    const gId = localStorage.getItem('gameId');
    const pId = localStorage.getItem('playerId');

    setGameId(gId);
    setPlayerId(pId);

    if (gId && pId) {
      eventSource = new EventSource('/game-events');

      eventSource.onmessage = (event) => {
        console.log(event);
        setGameState(event.data);
      };
    }

    loadGames();

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [loadGames]);

  return {
    loading,
    gameId,
    playerId,
    gameState,
    activeGames,
    loadGames,
    joinGame,
    createGame,
  };
};

export default useGameLoop;
