// src/upload/upload.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { Request } from 'express';
import { CloudinaryResult } from './upload.service'; // Importe CloudinaryResult
import { UploadApiErrorResponse } from 'cloudinary'; // Importe UploadApiErrorResponse

interface MulterFile extends Express.Multer.File {} // Defina uma interface local

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image') // Esta linha define a rota POST /upload/image
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() file: MulterFile,
  ): Promise<CloudinaryResult | UploadApiErrorResponse> {
    console.log('Arquivo recebido no controller:', file); // ADICIONE ESTE LOG
    return await this.uploadService.uploadImage(file);
  }
}
