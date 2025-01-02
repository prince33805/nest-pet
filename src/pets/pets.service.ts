import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet } from './entities/pet.entity';
import { formatToDatabaseTimestamp } from '../utils/dateUtils';
import { encryptData, decryptData } from '../utils/encryption';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
  ) { }

  async create(createPetDto: CreatePetDto, file: Express.Multer.File): Promise<Pet> {
    try {
      const pet = plainToInstance(Pet, createPetDto);
      pet.ownerName = encryptData(createPetDto.ownerName);
      pet.contactNumber = encryptData(createPetDto.contactNumber);

      if (file) {
        const relativePath = `uploads/${file.filename}`;
        pet.petPhoto = relativePath;
      }

      await this.petRepository.save(pet)
      return this.findOne(pet.id)
    } catch (error) {
      console.error('Error create pet:', error);
      throw new Error('Failed to create pet. Please try again later.');
    }
  }

  async findAll(): Promise<any[]> {
    try {
      const pets = await this.petRepository.find({
        where: {
          deletedDate: null,
        },
      });
      console.log("pets.length", pets.length)
      return pets.map((pet) => ({
        ...pet,
        ownerName: decryptData(pet.ownerName),
        contactNumber: decryptData(pet.contactNumber),
        createdDate: formatToDatabaseTimestamp(new Date(pet.createdDate), 'Asia/Bangkok'),
        updatedDate: formatToDatabaseTimestamp(new Date(pet.updatedDate), 'Asia/Bangkok'),
        deletedDate: pet.deletedDate
          ? formatToDatabaseTimestamp(new Date(pet.deletedDate), 'Asia/Bangkok')
          : null,
      }));
    } catch (error) {
      console.error('Error findAll pet:', error);
      throw new Error('Failed to findAll pet. Please try again later.');
    }

  }

  async getPets(limit: number): Promise<any[]> {
    try {
      const pets = await this.petRepository.find({
        where: {
          deletedDate: null,
        },
        take: limit, 
      });
      console.log("pets.length", pets.length)
      return pets.map((pet) => ({
        ...pet,
        ownerName: decryptData(pet.ownerName),
        contactNumber: decryptData(pet.contactNumber),
        createdDate: formatToDatabaseTimestamp(new Date(pet.createdDate), 'Asia/Bangkok'),
        updatedDate: formatToDatabaseTimestamp(new Date(pet.updatedDate), 'Asia/Bangkok'),
        deletedDate: pet.deletedDate
          ? formatToDatabaseTimestamp(new Date(pet.deletedDate), 'Asia/Bangkok')
          : null,
      }));
    } catch (error) {
      console.error('Error findAll pet:', error);
      throw new Error('Failed to findAll pet. Please try again later.');
    }

  }

  async findOne(id: string): Promise<any> {
    try {

      const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';
      const pet = await this.petRepository.findOneOrFail({ where: { id } });
      if (!pet) {
        throw new NotFoundException('Pet not found');
      }
      return {
        ...pet,
        ownerName: decryptData(pet.ownerName),
        contactNumber: decryptData(pet.contactNumber),
        petPhotoUrl: `${BASE_URL}/${pet.petPhoto}`,
        createdDate: formatToDatabaseTimestamp(new Date(pet.createdDate), 'Asia/Bangkok'),
        updatedDate: formatToDatabaseTimestamp(new Date(pet.updatedDate), 'Asia/Bangkok'),
        deletedDate: pet.deletedDate
          ? formatToDatabaseTimestamp(new Date(pet.deletedDate), 'Asia/Bangkok')
          : null, 

      }
    } catch (error) {
      console.error('Error findOne pet:', error);
      throw new Error('Failed to findOne pet. Please try again later.');
    }
  }

  async update(id: string, updatePetDto: UpdatePetDto, file: Express.Multer.File): Promise<Pet> {
    try {
      const pet = await this.petRepository.findOne({ where: { id } });
      if (!pet) {
        throw new NotFoundException('Pet not found');
      }

      if (updatePetDto.ownerName !== undefined) {
        pet.ownerName = encryptData(updatePetDto.ownerName);
      }
      if (updatePetDto.contactNumber !== undefined) {
        pet.contactNumber = encryptData(updatePetDto.contactNumber);
      }

      if (file) {
        console.log("file", file)
        const relativePath = `uploads/${file.filename}`;
        pet.petPhoto = relativePath;
      }

      pet.petName = updatePetDto.petName ?? pet.petName;
      pet.medicalHistory = updatePetDto.medicalHistory ?? pet.medicalHistory;
      pet.dateOfBirth = updatePetDto.dateOfBirth ?? pet.dateOfBirth;
      pet.weight = updatePetDto.weight ?? pet.weight;

      await this.petRepository.save(pet)
      return await this.findOne(pet.id)
    } catch (error) {
      console.error('Error update pet:', error);
      throw new Error('Failed to update pet. Please try again later.');
    }
  }

  async remove(id: string): Promise<void> {
    await this.petRepository.softDelete(id)
  }
}
