// image.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Patient } from './patient.entity';
import { Image } from './image.entity';

@Entity('diagnosis_record')
export class DiagnosisRecords {
  @PrimaryGeneratedColumn()
  diagnosis_id: number;

  @ManyToOne(() => Patient, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column()
  patient_id: number;

  @Column({ nullable: true })
  diagnosis_note: string;

  @Column({ type: 'date', nullable: true })
  date: string;

  //   @OneToOne(() => Image)
  //   @JoinColumn({ name: 'diagnosis_id' }) // Link this to the image's diagnosis_id
  //   image: Image;

  @OneToMany(() => Image, (image) => image.diagnosis)
  images: Image[];
}
