export default () => ({
  database: {
    type: 'sqlite',
    database: __dirname + '/../../db.sqlite',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
  },
});
