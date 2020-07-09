export class FloodTestDto {
  readonly id: string;

  readonly name: string;

  readonly description: string;

  readonly interval: number;

  readonly resultOverview: ResultOverviewDto;
}

export class ResultOverviewDto {
  readonly isPassing: null | boolean;
  readonly lastRun: null | Date;
}
