export interface Action {
  teamId: string;
  teamName: string;
  answer: boolean | string;
  teamToSabatage: undefined | string;
}
