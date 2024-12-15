import axios from 'axios';
import {
  ADMIN_NEXT_GAME_ENDPOINT,
  ADMIN_REVEAL_GAME_ENDPOINT,
  ADMIN_SHOW_GAME_ENDPOINT,
  ADMIN_START_GAME_ENDPOINT,
  PLAYER_PICK_ANSWER,
  PLAYER_PICK_QUESTION,
} from '../constants';
import { Action } from '../../../src/types/GameMove';

export const adminStart = (gameId: string, adminId: string) => {
  return axios.post(ADMIN_START_GAME_ENDPOINT, {
    gameId: gameId,
    adminId: adminId,
  });
};

export const adminShow = (gameId: string, adminId: string) => {
  return axios.post(ADMIN_SHOW_GAME_ENDPOINT, {
    gameId: gameId,
    adminId: adminId,
  });
};

export const adminReveal = (gameId: string, adminId: string) => {
  return axios.post(ADMIN_REVEAL_GAME_ENDPOINT, {
    gameId: gameId,
    adminId: adminId,
  });
};

export const adminNext = (gameId: string, adminId: string) => {
  return axios.post(ADMIN_NEXT_GAME_ENDPOINT, {
    gameId: gameId,
    adminId: adminId,
  });
};

export const playerPickQuestion = (
  gameId: string,
  teamId: string,
  catId: string,
  questionValue: number,
) => {
  return axios.post(PLAYER_PICK_QUESTION, {
    gameId,
    teamId,
    catId,
    questionValue,
  });
};

export const playerAnswerQuestion = (
  gameId: string,
  teamId: string,
  action: Action,
) => {
  return axios.post(PLAYER_PICK_ANSWER, {
    gameId,
    teamId,
    action,
  });
};
