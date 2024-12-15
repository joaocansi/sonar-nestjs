import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { fromIni } from '@aws-sdk/credential-providers';

import { MailerModule } from '@nestjs-modules/mailer';
import AppController from './app.controller';
import AppService from './app.service';

const fetchSecrets = async (secretName: string) => {
  const configService = new ConfigService();
  const client = new SecretsManagerClient({
    region: configService.get('AWS_REGION'),
    credentials: fromIni(),
  });

  console.log(await client.config.credentials());

  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
      }),
    );
    return JSON.parse(response.SecretString);
  } catch (error) {
    throw error;
  }
};

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      load: [
        async () => {
          const configService = new ConfigService();
          if (configService.get('NODE_ENV') === 'prod') {
            const secretName = configService.get('AWS_SECRET_NAME');
            const secrets = await fetchSecrets(secretName);
            console.log(secrets);
            return {
              MAILER_HOST: secrets.MAILER_HOST,
              MAILER_PORT: secrets.MAILER_PORT,
              MAILER_USERNAME: secrets.MAILER_USERNAME,
              MAILER_PASSWORD: secrets.MAILER_PASSWORD,
            };
          }
        },
      ],
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          transport: {
            host: configService.get('MAILER_HOST'),
            port: configService.get<number>('MAILER_PORT'),
            auth: {
              user: configService.get('MAILER_USERNAME'),
              pass: configService.get('MAILER_PASSWORD'),
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
