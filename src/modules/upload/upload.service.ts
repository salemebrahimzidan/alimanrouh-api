import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  upload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return {
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/packages/${file.filename}`,
    };
  }
}