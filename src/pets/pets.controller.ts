import { UseGuards, UseInterceptors, UploadedFile, Controller, Res, Get, Post, Body, Patch, Param, Delete, InternalServerErrorException, BadRequestException, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet } from './entities/pet.entity';
import { join } from 'path';
import { createReadStream, existsSync } from 'fs';
import { Response } from 'express';
import { multerConfig } from '../config/multer.config';
import { AuthGuard } from '@nestjs/passport';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) { }

  @Post()
  @UseInterceptors(FileInterceptor('petPhoto', multerConfig))
  async create(
    @Body() createPetDto: CreatePetDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Pet> {
    try {
      return await this.petsService.create(createPetDto, file);
    } catch (error) {
      throw new InternalServerErrorException('Could not create pet.');
    }
  }

  @Get('photo/:filename')
  async getPetPhoto(@Param('filename') filename: string, @Res() res: Response) {
    const filepath = join(__dirname, '..', '..', 'uploads', filename);
    if (!existsSync(filepath)) {
      return res.status(404).json({ message: 'Image not found' });
    }
    const stream = createReadStream(filepath);
    stream.pipe(res);
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Get()
  // async findAll(): Promise<Pet[]> {
  //   return await this.petsService.findAll();
  // }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getPets(@Query('limit') limit: string): Promise<Pet[]> {
    const recordLimit = parseInt(limit, 10) || 10;
    return await this.petsService.getPets(recordLimit);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Pet> {
    return await this.petsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @UseInterceptors(FileInterceptor('petPhoto', multerConfig))
  async update(
    @Param('id') id: string,
    @Body() updatePetDto: UpdatePetDto,
    @UploadedFile() file: Express.Multer.File): Promise<Pet> {
    try {
      return await this.petsService.update(id, updatePetDto, file);
    } catch (error) {
      throw new InternalServerErrorException('Could not update pet.');
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.petsService.remove(id);
  }
}
