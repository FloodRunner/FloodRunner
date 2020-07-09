import { Constants } from '../../constants/constants';

export class Helpers {
  static createJobSchedule(minutes: number): string {
    return `${minutes} minutes`;
  }

  static createJobName(testId: string): string {
    return `${Constants.ElementTestJobName} - ${testId}`;
  }
}
