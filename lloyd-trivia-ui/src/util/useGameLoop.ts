import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import {
  CREATE_GAME_ENDPOINT,
  EVENT_SOURCE_ENDPOINT,
  GAME_STATE_UPDATE_ENDPOINT,
  JOIN_GAME_ENDPOINT,
} from '../constants';
import { GameState } from '../../../src/types/GameState';
import { v4 as uuidv4 } from 'uuid';

const useGameLoop = () => {
  const [activeGame, setActiveGame] = useState(localStorage.getItem('gameId'));
  const [currentPlayerId, setCurrentPlayerId] = useState(
    localStorage.getItem('playerId'),
  );

  const showJoinOrCreateScreen = !activeGame || !currentPlayerId;

  const eventSource = useRef<EventSource>();

  const [activeGames, setActiveGames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [gameState, setGameState] = useState<GameState>();

  const loadGames = async () => {
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
  };

  const joinGame = async (
    gameId: string,
    teamName: string,
    avatarId: string,
  ) => {
    console.log('Joining game: ', gameId);

    setLoading(true);
    try {
      await axios.post(
        JOIN_GAME_ENDPOINT,
        {},
        {
          params: {
            gameId: gameId,
            teamName: teamName,
            avatarId: avatarId,
          },
        },
      );

      subscribeToEventSource(gameId, teamName);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const createGame = async (gameId: string) => {
    console.log('Creating game: ', gameId);
    const newAdminId = uuidv4();
    setLoading(true);

    try {
      await axios.post(
        CREATE_GAME_ENDPOINT,
        {},
        {
          params: {
            gameId: gameId,
            adminId: newAdminId,
          },
        },
      );

      subscribeToEventSource(gameId, newAdminId);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const subscribeToEventSource = (gameId: string, playerId: string) => {
    console.log('SUBSCRIBING TO GAME LOOP');

    localStorage.setItem('gameId', gameId);
    localStorage.setItem('playerId', playerId);

    const params = `?gameId=${encodeURIComponent(gameId)}&playerId=${encodeURIComponent(playerId)}`;
    eventSource.current = new EventSource(EVENT_SOURCE_ENDPOINT + params);

    eventSource.current.onmessage = (event: any) => {
      console.log('UPDATE RECIEVED');
      setGameState(JSON.parse(event.data));
      setLoading(false);
    };

    eventSource.current.onerror = () => {
      console.log('ERROR CONNECTING TO GAME LOOP');
      //localStorage.clear();
      eventSource.current?.close();
    };
  };

  useEffect(() => {
    loadGames();
  }, []);

  return {
    showJoinOrCreateScreen,
    loading,
    gameState,
    activeGames,
    loadGames,
    joinGame,
    createGame,
  };
};

export default useGameLoop;
