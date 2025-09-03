import { Controller, Post, Body, ValidationPipe, Inject } from '@nestjs/common';
import { CreateClientFormDto } from './dto/create-client-form.dto';

@Controller('client-form')
export class ClientFormController {
  constructor(@Inject('ClientFormService') private readonly clientFormService: any) {}

  @Post()
  async create(@Body(new ValidationPipe()) createClientFormDto: CreateClientFormDto) {
    return this.clientFormService.create(createClientFormDto);
  }
}
