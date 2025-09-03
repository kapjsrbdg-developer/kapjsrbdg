import { Injectable } from '@nestjs/common';
import { CreateClientFormDto } from './dto/create-client-form.dto';

interface MockClientForm {
  id: string;
  namaLengkap: string;
  nomorHP: string;
  email: string;
  jumlahEntitas: number;
  jasaYangDibutuhkan: string;
  companies: string;
  createdAt: Date;
}

@Injectable()
export class ClientFormDevService {
  private mockData: MockClientForm[] = [];

  async create(createClientFormDto: CreateClientFormDto): Promise<MockClientForm> {
    const clientForm = {
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

  async findAll(): Promise<MockClientForm[]> {
    return this.mockData;
  }

  async findOne(id: string): Promise<MockClientForm | null> {
    return this.mockData.find(item => item.id === id) || null;
  }
}
