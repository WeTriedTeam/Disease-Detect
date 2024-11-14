import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '../entities/image.entity';
import { CreateImageDTO } from 'src/DTOs/create-image.dto';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async retrieveImageById(userId: number): Promise<{ filepath: string }[]> {
    return await this.imageRepository.find({
      select: ['filepath'],
      where: { user_id: userId },
    });
  }

  async create(
    createImageDTO: CreateImageDTO,
    filename: string,
    patientId: number,
    diagnosis_id: number,
  ): Promise<Image> {
    const image = new Image();

    image.filename = filename;
    image.filepath = './uploads/' + filename;
    image.filetype = createImageDTO.mimetype;
    image.size = createImageDTO.size;
    image.user_id = 1; //replace this with the real user_id later
    image.patient_id = patientId;
    image.diagnosis_id = diagnosis_id;

    return await this.imageRepository.save(image);
  }

  async deleteImage(id: number): Promise<void> {
    const result = await this.imageRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }
  }
}
