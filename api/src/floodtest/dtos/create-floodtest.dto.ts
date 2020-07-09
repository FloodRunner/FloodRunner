import { TestInterval } from '../validators/test-interval.validator';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  Validate,
} from 'class-validator';

export class CreateFloodTestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  readonly name: string;

  @IsString()
  @MaxLength(256)
  @IsOptional()
  readonly description: string;

  @Validate(TestInterval)
  readonly interval: number;
}
