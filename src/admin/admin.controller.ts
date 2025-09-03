import { Controller, Get, Inject } from '@nestjs/common';
import { IClientFormService, ClientFormData } from '../client-form/interfaces/client-form.interface';

@Controller('admin')
export class AdminController {
  constructor(@Inject('ClientFormService') private readonly clientFormService: IClientFormService) {}

  @Get('submissions')
  async getAllSubmissions() {
    const submissions = await this.clientFormService.findAll();
    return submissions.map((submission: ClientFormData) => ({
      ...submission,
      jasaYangDibutuhkan: JSON.parse(submission.jasaYangDibutuhkan || '[]'),
      companies: JSON.parse(submission.companies || '[]'),
    }));
  }
}
