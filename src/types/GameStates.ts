// eslint-disable-next-line @typescript-eslint/no-unused-vars
const gameStateOptions: string[] = [
  'NOT_STARTED',
  'PICKING_QUESTION',
  'ANSWERING',
  'RESULTS',
  'OVER',
];

export type GameStates = (typeof gameStateOptions)[number];
