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
  create(createClientFormDto: any): Promise<ClientFormData>;
  findAll(): Promise<ClientFormData[]>;
  findOne(id: string): Promise<ClientFormData | null>;
}
