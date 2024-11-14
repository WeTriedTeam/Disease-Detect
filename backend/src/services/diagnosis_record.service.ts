// patient.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiagnosisRecords } from 'src/entities/diagnosis_record.entity';

@Injectable()
export class DiagnosisRecordService {
  constructor(
    @InjectRepository(DiagnosisRecords)
    private diagnosisRecordRepository: Repository<DiagnosisRecords>,
  ) {}

  // Method to find patient_id by name
  async getRecords(): Promise<DiagnosisRecords[]> {
    return await this.diagnosisRecordRepository.find({
      relations: ['patient'], // Load related patient details
    });
  }

  async getDiagnosisRecords(recordId: number) {
    const records = await this.diagnosisRecordRepository
      .createQueryBuilder('diagnosis')
      .leftJoinAndSelect('diagnosis.patient', 'patient')
      .leftJoinAndSelect('diagnosis.images', 'image')
      .leftJoinAndSelect('image.nodules', 'nodule')
      .select([
        'diagnosis.diagnosis_id AS id',
        "patient.firstname || ' ' || patient.lastname AS patientName",
        'diagnosis.diagnosis_note AS diagnosisNote',
        'diagnosis.date AS date',
        'image.filepath AS imgRef',
        'image.filename AS filename',
        'nodule.position AS boxPosition',
      ])
      .where('diagnosis.diagnosis_id = :id', { id: recordId }) // Filter by diagnosis_id
      .getRawMany();

    if (!records.length) {
      throw new NotFoundException(
        `Diagnosis record with id ${recordId} not found`,
      );
    }

    // return records.map((record) => ({
    //   id: record.id,
    //   patientName: record.patientname,
    //   diagnosisNote: record.diagnosisnote,
    //   date: record.date.toLocaleDateString('en-CA'),
    //   imgRef: record.imgref,
    //   filename: record.filename,
    //   boxes: record.boxPosition,
    // }));

    const formattedRecord = {
      id: records[0].id,
      patientName: records[0].patientname,
      diagnosisNote: records[0].diagnosisnote,
      date: new Date(records[0].date).toLocaleDateString('en-CA'),
      imgRef: records[0].imgref,
      filename: records[0].filename,
      boxes: records
        .map((item) => item.boxposition)
        .filter((position) => position !== null),
    };

    return formattedRecord;
  }

  async addRecord(patientId: number) {
    const record = new DiagnosisRecords();
    const currentDate = new Date();

    record.date = currentDate.toLocaleDateString('en-CA'); // format date in YYYY-mm-DD
    record.diagnosis_note = 'Lung Problem';
    record.patient_id = patientId;

    return (await this.diagnosisRecordRepository.save(record)).diagnosis_id;
  }
}
