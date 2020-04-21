import { Controller } from 'egg';
import { CodeGeneratorConfig } from '../typings/common';

export default class CodeGeneratorController extends Controller {
  async codeGenerator() {
    const { ctx, service } = this;
    const {
      author,
      table_name: tableName,
      table_annotation: tableAnnotation,
      db_host: dbHost,
      db_port: dbPort,
      db_user: dbUser,
      db_password: dbPassword,
      db_name: dbName,
      disk_path: diskPath,
    } = ctx.request.body;

    const codeGeneratorConfig: CodeGeneratorConfig = {
      author: String(author),
      tableName: String(tableName),
      tableAnnotation: String(tableAnnotation),
      dbConnectConfig: {
        dbHost: String(dbHost),
        dbPort: String(dbPort),
        dbUser: String(dbUser),
        dbPassword: String(dbPassword),
        dbName: String(dbName),
      },
      diskPath: String(diskPath),
    };

    const result = await service.codeGeneratorService.codeGenerator(
      codeGeneratorConfig,
    );

    ctx.body = result;
  }
}
