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

  getInfoForTeamView(includeTeamId: boolean = false) {
    return {
      teamId: includeTeamId ? this.teamId : undefined,
      name: this.name,
      avatarId: this.avatarId,
      score: this.score,
      sabatages: this.sabatages,
    };
  }
}
