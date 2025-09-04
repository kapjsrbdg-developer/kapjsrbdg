import { Controller, Get, Post, Body } from '@nestjs/common';
import { SubmitService } from './submit.service';

@Controller('submit')
export class SubmitController {
  constructor(private readonly submitService: SubmitService) {}

  @Get('health')
  getHealth(): object {
    return this.submitService.getHealth();
  }

  @Post()
  submitData(@Body() data: any): object {
    return this.submitService.submitData(data);
  }
}