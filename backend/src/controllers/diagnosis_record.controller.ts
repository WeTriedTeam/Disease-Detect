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
import { DiagnosisRecords } from 'src/entities/diagnosis_record.entity';

import { DiagnosisRecordService } from 'src/services/diagnosis_record.service';

@Controller()
export class DiagnosisRecordController {
  constructor(
    private readonly diagnosisRecordService: DiagnosisRecordService,
  ) {}

  @Get('records')
  async getRecords() {
    const records = await this.diagnosisRecordService.getRecords();
    console.log(records);

    return records.map((diagnosis) => ({
      diagnosis_id: diagnosis.diagnosis_id,
      diagnosis_note: diagnosis.diagnosis_note,
      diagnosis_date: diagnosis.date.toString(),
      patient: {
        firstname: diagnosis.patient.firstname,
        lastname: diagnosis.patient.lastname,
      },
    }));
  }

  @Get('records:record_id')
  async getRecordById(@Param('record_id') recordId: number) {
    const data =
      await this.diagnosisRecordService.getDiagnosisRecords(recordId);
    return data;
  }
}
