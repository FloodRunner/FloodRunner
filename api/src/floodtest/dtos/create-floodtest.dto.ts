import { TestInterval } from '../validators/test-interval.validator';
import { TestType } from '../../common/enums/test-types.enum';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  Validate,
  IsEnum,
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

  @IsNotEmpty()
  @IsEnum(TestType, {
    message: "type should be either 'puppeteer' or 'element'",
  })
  readonly type: TestType;
}
