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
} from '@nestjs/common';
import { FileInterceptor, MulterModule } from '@nestjs/platform-express';
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

@ApiTags('floodrunner')
@Controller('floodtest')
@UseGuards(AuthGuard())
export class FloodtestController {
  private _logger = new Logger('FloodTestController');

  constructor(private readonly floodTestService: FloodtestService) {}

  //#region Create Flood Test
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
    summary: 'Create a Flood Test for scheduled monitoring',
  })
  @ApiCreatedResponse({
    description: 'Flood Element test was successfully created.',
  })
  @Post()
  @UseInterceptors(
    FileInterceptor('testScript', {
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
    await this.floodTestService.create(user, createFloodTestDto, testFileDto);
  }
  //#endregion

  //#region Get All Tests
  @ApiOperation({
    summary: 'Returns all created Flood Tests',
  })
  @ApiOkResponse({
    description: 'All the created Flood Tests',
    isArray: true,
    type: () => FloodTestDto,
  })
  @Get()
  async findAll(@GetUser() user: User): Promise<FloodTest[]> {
    return this.floodTestService.findAll(user);
  }
  //#endregion

  //this can be uncommented when the `sendQueue` method is done as this conflicts with it when routing
  //#region Get Test By Id
  @ApiOperation({
    summary: 'Returns Flood Element test with specified id',
  })
  @ApiOkResponse({
    description: 'Created Flood Element test',
    type: () => FloodTestDto,
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Flood Element test scenario id',
  })
  @Get('/:id')
  async findById(
    @GetUser() user: User,
    @Param('id') id: string,
  ): Promise<FloodTest> {
    return this.floodTestService.findById(user, id);
  }
  //#endregion

  //#region Updated Flood Test
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
    summary: 'Update the Flood Test Scenario',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Flood Element test scenario id',
  })
  @Patch('/:id')
  @UseInterceptors(
    FileInterceptor('testScript', {
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

  //#region Delete Flood Test
  @ApiOperation({
    summary: 'Deletes the Flood Test Scenario',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Flood Element test scenario id',
  })
  @Delete('/:id')
  async delete(@GetUser() user: User, @Param('id') id: string) {
    this.floodTestService.delete(user, id);
  }
  //#endregion

  // @Get('/send')
  // sendQueue() {
  //   this.floodTestService.sendQueueMessage();
  // }

  //#region Download Flood Test script
  @ApiOperation({
    summary: 'Downloads the Flood Element test script',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Flood Element test scenario id',
  })
  @Get('/downloadtest/:id')
  downloadTest(@GetUser() user: User, @Param('id') id: string) {
    return this.floodTestService.downloadTestScript(user, id);
  }
  //#endregion

  //#region Get all Flood Test results
  @ApiOperation({
    summary: 'Returns the test run results of specified Flood Element test',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Flood Element test scenario id',
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
