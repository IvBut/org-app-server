import { registerAs } from '@nestjs/config';
import * as path from 'path';

export interface IAppConfig {
  NODE_ENV: string;
  HOST: string;
  PORT: number;
  WORKING_DIR: string;
}
export default registerAs('app', () => ({
  NODE_ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || '127.0.0.1',
  PORT: +process.env.PORT || 3000,
  WORKING_DIR: path.resolve(__dirname, '../../'),
}));
