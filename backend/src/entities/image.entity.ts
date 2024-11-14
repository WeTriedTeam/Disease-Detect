// image.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Patient } from './patient.entity';
import { DiagnosisRecords } from './diagnosis_record.entity';
import { NoduleObject } from './nodule_object.entity';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn()
  image_id: number;

  @Column()
  filename: string;

  @Column()
  filepath: string;

  @Column()
  filetype: string;

  @Column()
  size: number;

  @Column()
  user_id: number;

  @Column()
  patient_id: number;

  @Column()
  diagnosis_id: number;

  @ManyToOne(() => Patient, (patient) => patient.patient_id)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  // @OneToOne(() => DiagnosisRecords, (diagnosis) => diagnosis.image)
  // @JoinColumn({ name: 'diagnosis_id' })
  // diagnosis: DiagnosisRecords;

  @ManyToOne(() => DiagnosisRecords, (diagnosis) => diagnosis.images)
  @JoinColumn({ name: 'diagnosis_id' })
  diagnosis: DiagnosisRecords;

  @OneToMany(() => NoduleObject, (nodule) => nodule.image)
  nodules: NoduleObject[];
}
