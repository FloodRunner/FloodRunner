import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsDate,
  IsDateString,
} from 'class-validator';

export class CreateApiAccessTokenDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  readonly name: string;

  @IsString()
  @MaxLength(256)
  @IsOptional()
  readonly description: string;

  @IsDateString()
  readonly expiresAt: Date;
}
