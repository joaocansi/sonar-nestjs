import { Global, Module } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Global()
@Module({
  providers: [
    {
      provide: DataSource,
      useFactory: async () => {
        const dataSource = new DataSource({
          type: 'sqlite',
          database: __dirname + '/../../db.sqlite',
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
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
