import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { DatabaseModule } from './database.module';

describe('DatabaseModule', () => {
  let configService: Partial<ConfigService>;
  let dataSource: DataSource;

  beforeEach(async () => {
    configService = {
      get: jest.fn().mockImplementation((key: string) => {
        const config = {
          DATABASE_TYPE: 'sqlite',
        };
        return config[key];
      }),
    };

    Object.defineProperty(DataSource.prototype, 'isInitialized', {
      value: true,
      writable: true,
    });

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule],
    })
      .overrideProvider(ConfigService)
      .useValue(configService)
      .compile();

    dataSource = module.get(DataSource);
  });

  it('should return the dataSource', async () => {
    expect(dataSource).toHaveProperty('isInitialized', true);
    expect(configService.get('DATABASE_TYPE')).toBe('sqlite');
  });
});
