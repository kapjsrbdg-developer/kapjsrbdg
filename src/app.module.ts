import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientFormModule } from './client-form/client-form.module';
import { AdminModule } from './admin/admin.module';
import { ClientForm } from './client-form/entities/client-form.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'jsr_database',
      entities: [ClientForm],
      synchronize: process.env.NODE_ENV !== 'production', // Auto-sync tables
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }),
    ClientFormModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
