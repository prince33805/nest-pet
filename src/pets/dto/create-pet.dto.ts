import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsNumber, IsNotEmpty } from 'class-validator';

export class CreatePetDto {

  @IsString()
  @IsNotEmpty()
  ownerName: string;
  
  @IsString()
  petName: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  dateOfBirth: Date;
  
  @IsNumber()  
  @IsNotEmpty()
  weight: number;

  @IsString()
  @IsOptional()
  medicalHistory?: string;

  @IsString()
  @IsOptional()
  petPhoto?: string;

  @IsString()
  @IsNotEmpty()
  contactNumber: string;

}
