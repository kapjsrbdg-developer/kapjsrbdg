import { Controller, Get, Inject } from '@nestjs/common';

@Controller('admin')
export class AdminController {
  constructor(@Inject('ClientFormService') private readonly clientFormService: any) {}

  @Get('submissions')
  async getAllSubmissions() {
    const submissions = await this.clientFormService.findAll();
    return submissions.map((submission: any) => ({
      ...submission,
      jasaYangDibutuhkan: JSON.parse(submission.jasaYangDibutuhkan || '[]'),
      companies: JSON.parse(submission.companies || '[]'),
    }));
  }
}
