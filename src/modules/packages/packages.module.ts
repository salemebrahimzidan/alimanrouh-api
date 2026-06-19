import { Module } from '@nestjs/common';

import { CloudinaryService } from '../../common/services/cloudinary.service';
import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';

@Module({
  controllers: [PackagesController],
  providers: [PackagesService, CloudinaryService],
})
export class PackagesModule {}