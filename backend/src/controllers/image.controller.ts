import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
  NotFoundException,
} from '@nestjs/common';
import { ImageService } from 'src/services/image.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer'; // Import the Multer type
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PatientService } from 'src/services/patient.service';
import { DiagnosisRecordService } from 'src/services/diagnosis_record.service';

@Controller()
export class ImageController {
  constructor(
    private readonly imageService: ImageService,
    private readonly patientService: PatientService,
    private readonly diagnosisRecordService: DiagnosisRecordService,
  ) {}

  @Get()
  getDefault(): string {
    return 'No image';
  }

  @Get('user-image:user_id')
  async getImage(@Param('user_id') userId: number) {
    const entries = await this.imageService.retrieveImageById(userId);

    if (!entries || entries.length === 0) {
      throw new NotFoundException('No image paths found for the given user ID');
    }
    return entries;
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads', // Folder to save uploaded files
        filename: (req, file, callback) => {
          // Extract patient details from the request body and sanitize
          // const patientFirstName = req.body.patient_firstname;
          // const patientLastName = req.body.patient_lastname;
          // const sanitizedFirstName = patientFirstName.replace(/\s+/g, '_');
          // const sanitizedLastName = patientLastName.replace(/\s+/g, '_');

          // Generate a unique file name
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname); // Extract the file extension
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  ) // Expecting 'image' key in form-data
  async uploadImage(
    @Body('patient_firstname') patientFirstName: string,
    @Body('patient_lastname') patientLastName: string,
    @UploadedFile() file: Multer.File,
  ) {
    const patientId = await this.patientService.findPatientIdByName(
      patientFirstName,
      patientLastName,
    );

    const diagnosis_id = await this.diagnosisRecordService.addRecord(patientId);
    await this.imageService.create(
      file,
      file.filename,
      patientId,
      diagnosis_id,
    );

    return {
      message: 'Image file received',
      filename: file.filename,
      path: `/uploads/${file.filename}`,
    };
  }

  @Delete(':id')
  async deleteImage(
    @Param('image_id') id: number,
  ): Promise<{ message: string }> {
    await this.imageService.deleteImage(id);
    return { message: `Image with ID ${id} deleted successfully` };
  }
}
