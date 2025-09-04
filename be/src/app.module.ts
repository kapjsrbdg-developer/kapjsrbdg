import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubmitModule } from './submit/submit.module';

@Module({
  imports: [SubmitModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
