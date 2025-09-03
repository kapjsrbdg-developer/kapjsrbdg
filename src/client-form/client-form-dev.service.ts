import { Injectable } from '@nestjs/common';
import { CreateClientFormDto } from './dto/create-client-form.dto';
import { ClientFormData, IClientFormService } from './interfaces/client-form.interface';

@Injectable()
export class ClientFormDevService implements IClientFormService {
  private mockData: ClientFormData[] = [];

  async create(createClientFormDto: CreateClientFormDto): Promise<ClientFormData> {
    const clientForm: ClientFormData = {
      id: Date.now().toString(),
      namaLengkap: createClientFormDto.personalData.namaLengkap,
      nomorHP: createClientFormDto.personalData.nomorHP,
      email: createClientFormDto.personalData.email,
      jumlahEntitas: createClientFormDto.jumlahEntitas,
      jasaYangDibutuhkan: JSON.stringify(createClientFormDto.jasaYangDibutuhkan),
      companies: JSON.stringify(createClientFormDto.companies),
      createdAt: new Date(),
    };

    this.mockData.push(clientForm);
    return clientForm;
  }

  async findAll(): Promise<ClientFormData[]> {
    return this.mockData;
  }

  async findOne(id: string): Promise<ClientFormData | null> {
    return this.mockData.find(item => item.id === id) || null;
  }
}
