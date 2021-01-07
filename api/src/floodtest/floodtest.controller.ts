import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  Delete,
  Patch,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FloodtestService } from './services/floodtest.service';
import { CreateFloodTestDto } from './dtos/create-floodtest.dto';
import { FloodTest } from './repositories/schemas/flood-test.schema';
import { FloodTestResultSummary } from './repositories/schemas/flood-test-result-summary.schema';
import { TestFileDto } from './dtos/test-file.dto';
import { Logger } from '@nestjs/common';
import { Constants } from '../constants/constants';
import { FloodTestDto } from './dtos/floodtest.dto';
import { FloodTestResultSummaryDto } from './dtos/floodtest-result-summary.dto';
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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiAccessTokenAuthGuard } from 'src/access-token/guards/api-access-token-auth.guard';
import { FloodTestJobService } from './services/flood-test-job.service';

@ApiTags('floodrunner')
@Controller('floodtest')
@UseGuards(ApiAccessTokenAuthGuard, JwtAuthGuard)
export class FloodtestController {
  private _logger = new Logger('FloodTestController');

  constructor(
    private readonly floodTestService: FloodtestService,
    private readonly floodTestJobService: FloodTestJobService,
  ) {}

  //#region Create Browser Test
  @ApiConsumes('multipart/form-data')
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
    summary: 'Create a browser test for scheduled monitoring',
  })
  @ApiCreatedResponse({
    description: 'browser test was successfully created.',
  })
  @Post()
  @UseInterceptors(
    FileInterceptor('testFile', {
      dest: '/testScripts',
      preservePath: true,
      limits: {
        fileSize: Constants.MaxSizeInBytes,
      },
      fileFilter: function(req, file, cb) {
        if (!file.originalname.match(/\.(ts)$/)) {
          return cb(
            new Error('File upload error, only ts files are allowed.'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async create(
    @GetUser() user: User,
    @Body(ValidationPipe) createFloodTestDto: CreateFloodTestDto,
    @UploadedFile() testFileDto: TestFileDto,
  ) {
    if (!!!testFileDto && !!!createFloodTestDto.testScript) {
      const errorMessage = `No test file or script supplied. Please supply a test file or script`;
      this._logger.error(errorMessage);
      throw new BadRequestException(errorMessage);
    }

    await this.floodTestService.create(user, createFloodTestDto, testFileDto);
  }
  //#endregion

  //#region Get All Tests
  @ApiOperation({
    summary: 'Returns all created browser tests',
  })
  @ApiOkResponse({
    description: 'All the created browser tests',
    isArray: true,
    type: () => FloodTestDto,
  })
  @Get()
  async findAll(@GetUser() user: User): Promise<FloodTest[]> {
    return this.floodTestService.findAll(user);
  }
  //#endregion

  //#region Get Test By Id
  @ApiOperation({
    summary: 'Returns browser test with specified id',
  })
  @ApiOkResponse({
    description: 'Created browser test',
    type: () => FloodTestDto,
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Browser test id',
  })
  @Get('/:id')
  async findById(
    @GetUser() user: User,
    @Param('id') id: string,
  ): Promise<FloodTest> {
    return this.floodTestService.findById(user, id);
  }
  //#endregion

  //#region Update Browser Test
  @ApiConsumes('multipart/form-data')
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
        testScript: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Update the browser test',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Browser test id',
  })
  @Patch('/:id')
  @UseInterceptors(
    FileInterceptor('testFile', {
      dest: '/testScripts',
      preservePath: true,
      limits: {
        fileSize: Constants.MaxSizeInBytes,
      },
      fileFilter: function(req, file, cb) {
        if (!file.originalname.match(/\.(ts)$/)) {
          return cb(
            new Error('File upload error, only ts files are allowed.'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  update(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body(ValidationPipe) updateFloodTestDto: CreateFloodTestDto,
    @UploadedFile() file,
  ): Promise<FloodTest> {
    return this.floodTestService.update(user, id, updateFloodTestDto);
  }
  //#endregion

  //#region Delete Browser Test
  @ApiOperation({
    summary: 'Deletes the browser test',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Browser test id',
  })
  @Delete('/:id')
  async delete(@GetUser() user: User, @Param('id') id: string) {
    this.floodTestService.delete(user, id);
  }
  //#endregion

  //#region Run Browser Test
  @ApiOperation({
    summary: 'Run browser test using id',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Browser test id',
  })
  @Post('/runtest/:id')
  async runBrowserTestById(@GetUser() user: User, @Param('id') id: string) {
    return this.floodTestJobService.runScheduledBrowserTest(user, id);
  }

  @ApiConsumes('multipart/form-data')
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
          description:
            'Ignored for this call as this test will not run on a schedule. Use Create endpoint for creating a scheduled browser test.',
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
    summary: 'Run browser test using test script',
  })
  @UseInterceptors(
    FileInterceptor('testFile', {
      dest: '/testScripts',
      preservePath: true,
      limits: {
        fileSize: Constants.MaxSizeInBytes,
      },
      fileFilter: function(req, file, cb) {
        if (!file.originalname.match(/\.(ts)$/)) {
          return cb(
            new Error('File upload error, only ts files are allowed.'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @Post('/runtest')
  async runBrowserTestByScript(
    @GetUser() user: User,
    @Body(ValidationPipe) createFloodTestDto: CreateFloodTestDto,
    @UploadedFile() testFileDto: TestFileDto,
  ) {
    if (!!!testFileDto && !!!createFloodTestDto.testScript) {
      const errorMessage = `No test file or script supplied. Please supply a test file or script`;
      this._logger.error(errorMessage);
      throw new BadRequestException(errorMessage);
    }

    const testId = this.floodTestService.createTestId();
    await this.floodTestService.uploadTest(
      testId,
      createFloodTestDto,
      testFileDto,
    );
    return this.floodTestJobService.runUnscheduledBrowserTest(
      testId,
      createFloodTestDto.type,
      testId,
    );
  }
  //#endregion

  //#region Download Browser Test script
  @ApiOperation({
    summary: 'Downloads the browser test script',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Browser test id',
  })
  @Get('/downloadtest/:id')
  downloadTest(@GetUser() user: User, @Param('id') id: string) {
    return this.floodTestService.downloadTestScript(user, id);
  }
  //#endregion

  //#region Get all Browser Test results
  @ApiOperation({
    summary: 'Returns the test run results of specified browser test',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Browser test id',
  })
  @ApiOkResponse({
    description: 'All the test run results',
    isArray: true,
    type: () => FloodTestResultSummaryDto,
  })
  @Get('/results/:id')
  getResults(@Param('id') id: string): Promise<FloodTestResultSummary[]> {
    return this.floodTestService.getTestResults(id);
  }
  //#endregion
}
