// patient.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  // Method to find patient_id by name
  async findPatientIdByName(
    firstname: string,
    lastname: string,
  ): Promise<number> {
    const patient = await this.patientRepository.findOne({
      where: { firstname, lastname },
      select: ['patient_id'],
    });

    if (!patient) {
      throw new NotFoundException(`Patient with name "${name}" not found`);
    }

    return patient.patient_id;
  }
}
