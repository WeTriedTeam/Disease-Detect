// patient.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Image } from './image.entity'; // Import the Image entity if it relates to images
import { DiagnosisRecords } from './diagnosis_record.entity';

@Entity('patient') // This will be the table name in the database
export class Patient {
  @PrimaryGeneratedColumn()
  patient_id: number;

  @Column({ length: 50 })
  firstname: string;

  @Column({ length: 50 })
  lastname: string;

  @Column({ type: 'date' })
  dob: Date;

  @Column({ type: 'char', length: 1 })
  sex: string; // 'M' or 'F' for male/female

  @Column({ length: 15, nullable: true })
  phone: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  // One-to-many relationship with Image if an image is associated with a patient
  @OneToMany(() => Image, (image) => image.patient_id)
  images: Image[];

  @OneToMany(() => DiagnosisRecords, (diagnosis) => diagnosis.patient)
  diagnoses: DiagnosisRecords[];
}
