import convict from 'convict';
import validator from 'convict-format-with-validator';
import { ConfigSchema } from './config.type.js';

convict.addFormats(validator);

export const configSchema = convict<ConfigSchema>({
  PORT: {
    doc: 'Номер порта, на котором приложение ожидает подключений',
    format: 'port',
    env: 'PORT',
    default: 1337
  },
  SALT: {
    doc: 'Соль',
    format: String,
    env: 'SALT',
    default: '0'
  },
  DB_HOST: {
    doc: 'Адрес сервера',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: '127.0.0.1'
  },
  DB_USER: {
    doc: 'Имя пользователя для подключения к базе данных',
    format: String,
    env: 'DB_USER',
    default: null,
  },
  DB_PASSWORD: {
    doc: 'Пароль для подключения к базе данных',
    format: String,
    env: 'DB_PASSWORD',
    default: null,
  },
  DB_PORT: {
    doc: 'Порт для подключения к базе данных',
    format: 'port',
    env: 'DB_PORT',
    default: '27017',
  },
  DB_NAME: {
    doc: 'Имя базы данных',
    format: String,
    env: 'DB_NAME',
    default: 'buy-and-sell'
  },
  UPLOAD_DIRECTORY: {
    doc: 'Directory for upload files',
    format: String,
    env: 'UPLOAD_DIRECTORY',
    default: null
  },
  JWT_SECRET: {
    doc: 'Secret for sign JWT',
    format: String,
    env: 'JWT_SECRET',
    default: null
  },
});
