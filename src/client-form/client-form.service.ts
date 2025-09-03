import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientForm } from './entities/client-form.entity';
import { CreateClientFormDto } from './dto/create-client-form.dto';

@Injectable()
export class ClientFormService {
  constructor(
    @InjectRepository(ClientForm)
    private clientFormRepository: Repository<ClientForm>,
  ) {}

  async create(createClientFormDto: CreateClientFormDto): Promise<ClientForm> {
    const clientForm = this.clientFormRepository.create({
      namaLengkap: createClientFormDto.personalData.namaLengkap,
      nomorHP: createClientFormDto.personalData.nomorHP,
      email: createClientFormDto.personalData.email,
      jumlahEntitas: createClientFormDto.jumlahEntitas,
      jasaYangDibutuhkan: JSON.stringify(createClientFormDto.jasaYangDibutuhkan),
      companies: JSON.stringify(createClientFormDto.companies),
    });

    return this.clientFormRepository.save(clientForm);
  }

  async findAll(): Promise<ClientForm[]> {
    return this.clientFormRepository.find();
  }

  async findOne(id: string): Promise<ClientForm | null> {
    return this.clientFormRepository.findOne({ where: { id } });
  }
}
