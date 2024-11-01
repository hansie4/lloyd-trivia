export class Team {
  teamId: string;
  name: string;
  avatarId: string;
  score: number;
  sabatages: number;

  constructor(teamId: string, name: string, avatarId) {
    this.teamId = teamId;
    this.name = name;
    this.avatarId = avatarId;
    this.score = 0;
    this.sabatages = 1;
  }
}
