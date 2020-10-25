import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ValidationPipe,
  Delete,
  Patch,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import {
  ApiBody,
  ApiTags,
  ApiResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiOkResponse,
  ApiQuery,
  ApiConsumes,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from '../auth/repositories/schemas/user.schema';
import { AccessTokenService } from './services/access-token.service';
import { CreateApiAccessTokenDto } from './dtos/create-accesstoken.dto';
import { AccessTokenDto } from './dtos/access-token.dto';

@ApiTags('apiaccesstoken')
@Controller('apiaccesstoken')
@UseGuards(AuthGuard())
export class ApiAccessTokenController {
  private _logger = new Logger('ApiAccessTokenController');

  constructor(private readonly apiAccessTokenService: AccessTokenService) {}

  //#region Create Api Access Token
  // @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        interval: {
          type: 'string',
        },
        type: {
          type: 'string',
        },
        testScript: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Create an Api Access Token',
  })
  @ApiCreatedResponse({
    description: 'Api Access Token was successfully created.',
  })
  @Post()
  async create(
    @GetUser() user: User,
    @Body(ValidationPipe) createApiAccessTokenDto: CreateApiAccessTokenDto,
  ) {
    await this.apiAccessTokenService.create(user, createApiAccessTokenDto);
    this._logger.log(`Created api access token for user, userId: ${user._id}`);
  }
  //#endregion

  //#region Delete Api Access Token
  @ApiOperation({
    summary: 'Deletes the specified API Access Token',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'API Access Token id',
  })
  @Delete('/:id')
  async delete(@GetUser() user: User, @Param('id') id: string) {
    this.apiAccessTokenService.delete(user, id);
  }
  //#endregion

  //#region Get all API Access Tokens for the user
  @ApiOperation({
    summary: 'Returns all created api access tokens',
  })
  @ApiOkResponse({
    description: 'All the created api access tokens',
    isArray: true,
    type: () => AccessTokenDto,
  })
  @Get()
  async findAll(@GetUser() user: User): Promise<AccessTokenDto[]> {
    return this.apiAccessTokenService.findAll(user);
  }
  //#endregion
}
