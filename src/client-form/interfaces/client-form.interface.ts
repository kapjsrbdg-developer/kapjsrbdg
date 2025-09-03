import { CreateClientFormDto } from '../dto/create-client-form.dto';

export interface ClientFormData {
  id: string;
  namaLengkap: string;
  nomorHP: string;
  email: string;
  jumlahEntitas: number;
  jasaYangDibutuhkan: string;
  companies: string;
  createdAt: Date;
}

export interface IClientFormService {
  create(createClientFormDto: CreateClientFormDto): Promise<ClientFormData>;
  findAll(): Promise<ClientFormData[]>;
  findOne(id: string): Promise<ClientFormData | null>;
}
