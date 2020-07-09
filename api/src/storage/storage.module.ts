import { Module } from '@nestjs/common';
import { Keys } from '../constants/keys';
import { AzureBlobService } from './services/azureblob.service';
import { LocalBlobService } from './services/localblob.service';

const fileServiceProvider = {
  provide: 'FileService',
  useClass:
    Keys.fileServiceStrategy === 'AZURE' ? AzureBlobService : LocalBlobService,
};

@Module({
  imports: [],
  providers: [fileServiceProvider],
  controllers: [],
  exports: [fileServiceProvider],
})
export class StorageModule {}
