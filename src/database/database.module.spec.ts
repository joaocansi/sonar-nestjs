import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { DatabaseModule } from './database.module';

describe('DatabaseModule', () => {
  let dataSource: DataSource;
  let configService: ConfigService;
  let initializeSpy: jest.SpyInstance;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn((key: string) => {
        const config = {
          DATABASE_TYPE: 'sqlite',
        };
        return config[key];
      }),
    };
    initializeSpy = jest
      .spyOn(DataSource.prototype, 'initialize')
      .mockImplementation(async () => {
        return Promise.resolve(dataSource);
      });

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule],
    })
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .compile();

    dataSource = module.get<DataSource>(DataSource);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(dataSource).toBeDefined();
    expect(configService).toBeDefined();
  });

  it('should call initialize when DataSource is created', () => {
    expect(initializeSpy).toHaveBeenCalled();
  });

  it('should use the mock ConfigService', () => {
    const testValue = configService.get('DATABASE_TYPE');
    expect(testValue).toBe('sqlite');
  });
});
