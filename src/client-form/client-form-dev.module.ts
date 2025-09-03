import { Module } from '@nestjs/common';
import { ClientFormController } from './client-form.controller';
import { ClientFormDevService } from './client-form-dev.service';

@Module({
  controllers: [ClientFormController],
  providers: [
    {
      provide: 'ClientFormService',
      useClass: ClientFormDevService,
    },
  ],
  exports: ['ClientFormService'],
})
export class ClientFormDevModule {}
