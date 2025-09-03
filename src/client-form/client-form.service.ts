import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientForm } from './entities/client-form.entity';
import { CreateClientFormDto } from './dto/create-client-form.dto';
import { IClientFormService, ClientFormData } from './interfaces/client-form.interface';

@Injectable()
export class ClientFormService implements IClientFormService {
  constructor(
    @InjectRepository(ClientForm)
    private clientFormRepository: Repository<ClientForm>,
  ) {}

  async create(createClientFormDto: CreateClientFormDto): Promise<ClientFormData> {
    const clientForm = this.clientFormRepository.create({
      namaLengkap: createClientFormDto.personalData.namaLengkap,
      nomorHP: createClientFormDto.personalData.nomorHP,
      email: createClientFormDto.personalData.email,
      jumlahEntitas: createClientFormDto.jumlahEntitas,
      jasaYangDibutuhkan: JSON.stringify(createClientFormDto.jasaYangDibutuhkan),
      companies: JSON.stringify(createClientFormDto.companies),
    });

    const saved = await this.clientFormRepository.save(clientForm);
    return {
      id: saved.id,
      namaLengkap: saved.namaLengkap,
      nomorHP: saved.nomorHP,
      email: saved.email,
      jumlahEntitas: saved.jumlahEntitas,
      jasaYangDibutuhkan: saved.jasaYangDibutuhkan,
      companies: saved.companies,
      createdAt: saved.createdAt,
    };
  }

  async findAll(): Promise<ClientFormData[]> {
    const forms = await this.clientFormRepository.find();
    return forms.map(form => ({
      id: form.id,
      namaLengkap: form.namaLengkap,
      nomorHP: form.nomorHP,
      email: form.email,
      jumlahEntitas: form.jumlahEntitas,
      jasaYangDibutuhkan: form.jasaYangDibutuhkan,
      companies: form.companies,
      createdAt: form.createdAt,
    }));
  }

  async findOne(id: string): Promise<ClientFormData | null> {
    const form = await this.clientFormRepository.findOne({ where: { id } });
    if (!form) return null;
    
    return {
      id: form.id,
      namaLengkap: form.namaLengkap,
      nomorHP: form.nomorHP,
      email: form.email,
      jumlahEntitas: form.jumlahEntitas,
      jasaYangDibutuhkan: form.jasaYangDibutuhkan,
      companies: form.companies,
      createdAt: form.createdAt,
    };
  }
}
