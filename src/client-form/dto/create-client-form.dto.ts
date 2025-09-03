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

export class CompanyDto {
  @IsString()
  @IsNotEmpty()
  namaEntitas: string;

  @IsString()
  @IsNotEmpty()
  bidangUsaha: string;

  @IsString()
  @IsNotEmpty()
  alamatPerusahaan: string;

  @IsString()
  @IsNotEmpty()
  tahunBuku: string;

  @IsString()
  @IsNotEmpty()
  pernahDiaudit: string; // Change from boolean to string

  @IsString()
  namaKAPSebelumnya?: string;

  @IsString()
  opiniKAPSebelumnya?: string;

  @IsString()
  @IsNotEmpty()
  jumlahPendapatan: string;

  @IsString()
  @IsNotEmpty()
  jumlahAset: string;
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
  @ValidateNested({ each: true })
  @Type(() => CompanyDto)
  companies: CompanyDto[];
}
