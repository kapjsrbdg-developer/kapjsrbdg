import { Module } from '@nestjs/common';
import { ClientFormDevModule } from './client-form/client-form-dev.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ClientFormDevModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
