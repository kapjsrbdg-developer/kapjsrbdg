import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { ClientFormDevModule } from '../client-form/client-form-dev.module';

@Module({
  imports: [ClientFormDevModule],
  controllers: [AdminController],
})
export class AdminModule {}
