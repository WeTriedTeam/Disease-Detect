import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageController } from './controllers/image.controller';
import { ImageService } from './services/image.service';
import { Image } from './entities/image.entity';
import { PatientService } from './services/patient.service';
import { Patient } from './entities/patient.entity';
import { DiagnosisRecords } from './entities/diagnosis_record.entity';
import { DiagnosisRecordService } from './services/diagnosis_record.service';
import { DiagnosisRecordController } from './controllers/diagnosis_record.controller';
import { NoduleObject } from './entities/nodule_object.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // Database type
      host: 'localhost', // Hostname (localhost for local DB)
      port: 5432, // Default PostgreSQL port
      username: 'postgres', // Your PostgreSQL username
      password: 'Happycabbage1###', // Your PostgreSQL password
      database: 'testa_db', // Database name
      entities: [Image, Patient, DiagnosisRecords, NoduleObject], // Entities
      synchronize: true, // Sync schema with the database; disable in production
    }),
    TypeOrmModule.forFeature([Image, Patient, DiagnosisRecords, NoduleObject]),
  ],
  controllers: [ImageController, DiagnosisRecordController],
  providers: [ImageService, PatientService, DiagnosisRecordService],
})
export class AppModule {}
