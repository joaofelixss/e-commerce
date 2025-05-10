// src/upload/upload.service.ts

import { Injectable } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
export type { UploadApiErrorResponse };

export interface CloudinaryResult extends UploadApiResponse {
  secure_url: string;
}

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {
    const cloudinaryUrl = this.configService.get<string>('CLOUDINARY_URL');
    if (cloudinaryUrl) {
      cloudinary.config(cloudinaryUrl);
    } else {
      console.error(
        'CLOUDINARY_URL não está definida nas variáveis de ambiente!',
      );
    }
  }

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<CloudinaryResult | UploadApiErrorResponse> {
    if (!file) {
      throw new Error('Nenhum arquivo recebido para upload.');
    }

    const fileBuffer = file.buffer;

    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) {
            return reject(error);
          }
          resolve(result as CloudinaryResult);
        },
      );

      if (fileBuffer) {
        Readable.from(fileBuffer).pipe(upload);
      } else {
        reject(new Error('file.buffer está undefined')); // Explicitly reject se o buffer for undefined
      }
    });
  }
}
