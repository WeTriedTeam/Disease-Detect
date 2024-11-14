import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Image } from './image.entity';

@Entity('noduleobject')
export class NoduleObject {
  @PrimaryGeneratedColumn()
  nodule_id: number;

  @ManyToOne(() => Image, (image) => image.nodules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'image_id' })
  image: Image;

  @Column({ length: 60 })
  position: string;

  @Column({ length: 500, nullable: true })
  doctor_note: string;

  @Column({ length: 45, nullable: true })
  intensity: string;
}
