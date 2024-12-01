import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Global()
@Module({
  providers: [
    {
      provide: DataSource,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const dataSource = new DataSource({
          type: config.get<any>('DATABASE_TYPE'),
          database: __dirname + '/../../db.sqlite',
          synchronize: true,
        });
        await dataSource.initialize();
        return dataSource;
      },
    },
  ],
  exports: [DataSource],
})
export class DatabaseModule {}
