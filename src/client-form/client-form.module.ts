import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientFormController } from './client-form.controller';
import { ClientFormService } from './client-form.service';
import { ClientForm } from './entities/client-form.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientForm])],
  controllers: [ClientFormController],
  providers: [ClientFormService],
  exports: [ClientFormService],
})
export class ClientFormModule {}
