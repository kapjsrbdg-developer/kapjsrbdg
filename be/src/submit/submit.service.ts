import { Injectable } from '@nestjs/common';

@Injectable()
export class SubmitService {
  getHealth(): object {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    };
  }
  submitData(data: any): object {
    //masukan input ke db disini seleum return
    return {
      status: 'success',
      message: 'Data submitted successfully',
      timestamp: new Date().toISOString(),
      data
    };
  }
}