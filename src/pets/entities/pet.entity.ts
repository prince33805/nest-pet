import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Double } from 'typeorm';

@Entity()
export class Pet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'owner_name' })
  ownerName: string;

  @Column({ name: 'pet_name' })
  petName: string;

  @Column({ name: 'date_of_birth', type: 'date' })
  dateOfBirth: Date;

  @Column({ name: 'weight', type: 'float' })
  weight: number;

  @Column({ name: 'medical_history', type: 'text' })
  medicalHistory?: string;

  @Column({ name: 'pet_photo' })
  petPhoto?: string;

  @Column({ name: 'contact_number' })
  contactNumber: string;

  @CreateDateColumn({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', type: 'timestamp' })
  updatedDate: Date;

  @DeleteDateColumn({ name: 'deleted_date', type: 'timestamp', nullable: true })
  deletedDate: Date | null;
}
