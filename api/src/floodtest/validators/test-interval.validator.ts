import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

const minInterval = 60;
const intervalMultiple = 10;

@ValidatorConstraint({ name: 'testInterval', async: false })
export class TestInterval implements ValidatorConstraintInterface {
  validate(interval: number, args: ValidationArguments) {
    return interval >= minInterval && interval % intervalMultiple == 0;
  }

  defaultMessage(args: ValidationArguments) {
    return `Interval specified ($value) must be greater than ${minInterval} minutes and a multiple of ${intervalMultiple}`;
  }
}
