import { FloodTest } from '../../floodtest/repositories/schemas/flood-test.schema';
export interface IJobService {
  setup(): void;
  start(callbackFunction: (message: string) => void): void;
  defineJob(floodTestId: string): void;
  createJob(floodTest: FloodTest): void;
  deleteJob(floodTestId: string): void;
  updateJob(floodTest: FloodTest): void;
}
