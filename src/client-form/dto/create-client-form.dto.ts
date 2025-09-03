import { IsString, IsEmail, IsNotEmpty, IsNumber, IsArray, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PersonalDataDto {
  @IsString()
  @IsNotEmpty()
  namaLengkap: string;

  @IsString()
  @IsNotEmpty()
  nomorHP: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class CreateClientFormDto {
  @IsObject()
  @ValidateNested()
  @Type(() => PersonalDataDto)
  personalData: PersonalDataDto;

  @IsNumber()
  jumlahEntitas: number;

  @IsArray()
  jasaYangDibutuhkan: string[];

  @IsArray()
  companies: any[];
}
