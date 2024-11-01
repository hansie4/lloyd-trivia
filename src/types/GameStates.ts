// eslint-disable-next-line @typescript-eslint/no-unused-vars
const gameStateOptions: string[] = [
  'WAITING',
  'PICKING_QUESTION',
  'ANSWERING',
  'RESULTS',
  'OVER',
];

export type GameStates = (typeof gameStateOptions)[number];
