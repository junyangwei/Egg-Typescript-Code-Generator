import { Service } from 'egg';
import * as path from 'path';
import * as fs from 'fs';
import * as moment from 'moment';
import Knex = require('knex');
import { CodeGeneratorConfig, DBConnectConfig, DBColumnItem, DataTypes } from '../typings/common';

const localProjectPath = path.join(__dirname, '..');

export const NumberDataTypes = [
  DataTypes.Int,
  DataTypes.TinyInt,
  DataTypes.SmallInt,
  DataTypes.MediumInt,
  DataTypes.BigInt,
  DataTypes.Float,
  DataTypes.Double,
  DataTypes.Decimal,
  DataTypes.Year,
];

// 定义不需要创建的参数
export const UnnessaryCreateParams = [
  'id',
  'create_time',
  'update_time',
];

export default class CodeGeneratorService extends Service {
  private knex: Knex;

  /**
   * 代码生成主函数
   * @param codeGeneratorConfig 代码生成所需配置数据
   */
  async codeGenerator(codeGeneratorConfig: CodeGeneratorConfig) {
    // 连接MySQL数据库
    await this.connectDB(codeGeneratorConfig.dbConnectConfig);

    // 生成Controller层TS文件
    await this.buildControllerTypescriptFile(codeGeneratorConfig);

    // 生成Service层TS文件
    await this.buildServiceTypescriptFile(codeGeneratorConfig);

    // 生成Dao层TS文件
    await this.buildDaoTypescriptFile(codeGeneratorConfig);

    // 生成Type层TS文件
    await this.buildTypeTypescriptFile(codeGeneratorConfig);

    return codeGeneratorConfig;
  }

  /**
   * 连接MySQL数据库
   * @param dbConnectConfig 数据库连接配置
   */
  async connectDB(dbConnectConfig: DBConnectConfig) {
    const dbClient = {
      client: 'mysql',
      debug: false,
      connection: {
        host: dbConnectConfig.dbHost,
        port: dbConnectConfig.dbPort,
        user: dbConnectConfig.dbUser,
        password: dbConnectConfig.dbPassword,
        database: dbConnectConfig.dbName,
      },
      pool: {
        max: 40,
        min: 5,
        idleTimeoutMillis: 120000,
      },
    };
    this.knex = Knex(dbClient);
  }

  /**
   * 生成Controller层TS文件
   */
  async buildControllerTypescriptFile(config: CodeGeneratorConfig) {
    // 获取模版文件，并转换成字符串
    const data = fs.readFileSync(`${localProjectPath}/template/Controller.ftl`);
    const file = data.toString();

    // 获取数据库表名首字母大写格式（示例：TableName）
    const upperCaseTableName = this.upperCaseField(
      config.tableName,
      true,
    );
    // 获取数据库表名首字母小写格式（示例：tableName）
    const lowerCaseTableName = this.upperCaseField(
      config.tableName,
      false,
    );

    // 获取数据库表字段信息
    const columnItems: DBColumnItem[] = await this.getColumnItem(config.tableName);

    // 构建输入参数及创建类参数
    let inputCreateParams = '';
    let createParams = '';
    for (let i = 0; i < columnItems.length; i += 1) {
      const column = columnItems[i];
      const camelCaseColumnName = this.upperCaseField(
        column.columnName,
        false,
      );

      const columnType = NumberDataTypes.includes(column.dataType)
        ? `Number(${camelCaseColumnName}) || 0`
        : `String(${camelCaseColumnName}) || ''`;

      if (UnnessaryCreateParams.includes(column.columnName)) {
        continue;
      }

      inputCreateParams += column.columnName.indexOf('_') >= 0
        ? `      ${column.columnName}: ${camelCaseColumnName},\n`
        : `      ${column.columnName},\n`;
      createParams += `      ${columnType},\n`;
    }

    // 去除最后一个换行符
    inputCreateParams = inputCreateParams.substring(0, inputCreateParams.length - 1);
    createParams = createParams.substring(0, createParams.length - 1);

    // 替换模版参数为需要的数据
    const resultFile = file
      .replace(/\${TableName}/g, upperCaseTableName)
      .replace(/\${tableName}/g, lowerCaseTableName)
      .replace(/\${author}/g, config.author)
      .replace(/\${date}/g, moment().format('YYYY-MM-DD'))
      .replace(/\${tableAnnotation}/g, config.tableAnnotation)
      .replace(/\${inputCreateParams}/g, inputCreateParams)
      .replace(/\${createParams}/g, createParams);

    // 写入文件
    fs.appendFile(
      `${config.diskPath}/controller/${config.tableName}.ts`,
      resultFile, 'utf8',
      function(err) {
        if (err) {
          throw err;
        }
      },
    );
  }

  /**
   * 生成Service层TS文件
   */
  async buildServiceTypescriptFile(config: CodeGeneratorConfig) {
    // 获取模版文件，并转换成字符串
    const data = fs.readFileSync(`${localProjectPath}/template/Service.ftl`);
    const file = data.toString();

    // 获取数据库表名首字母大写格式（示例：TableName）
    const upperCaseTableName = this.upperCaseField(
      config.tableName,
      true,
    );
    // 获取数据库表名首字母小写格式（示例：tableName）
    const lowerCaseTableName = this.upperCaseField(
      config.tableName,
      false,
    );

    // 获取数据库表字段信息
    const columnItems: DBColumnItem[] = await this.getColumnItem(config.tableName);

    // 构建输入参数及创建类参数
    let inputCreateParams = '';
    let createParams = '';
    for (let i = 0; i < columnItems.length; i += 1) {
      const column = columnItems[i];
      const camelCaseColumnName = this.upperCaseField(
        column.columnName,
        false,
      );

      const columnType = NumberDataTypes.includes(column.dataType)
        ? `${column.columnName}: Number(${camelCaseColumnName}) || 0`
        : `${column.columnName}: String(${camelCaseColumnName}) || ''`;

      if (UnnessaryCreateParams.includes(column.columnName)) {
        continue;
      }

      inputCreateParams += NumberDataTypes.includes(column.dataType)
        ? `    ${camelCaseColumnName}: number,\n`
        : `    ${camelCaseColumnName}: string,\n`;
      createParams += `        ${columnType},\n`;
    }

    // 去除最后一个换行符
    inputCreateParams = inputCreateParams.substring(0, inputCreateParams.length - 1);
    createParams = createParams.substring(0, createParams.length - 1);

    // 替换模版参数为需要的数据
    const resultFile = file
      .replace(/\${TableName}/g, upperCaseTableName)
      .replace(/\${tableName}/g, lowerCaseTableName)
      .replace(/\${author}/g, config.author)
      .replace(/\${date}/g, moment().format('YYYY-MM-DD'))
      .replace(/\${tableAnnotation}/g, config.tableAnnotation)
      .replace(/\${table_name}/g, config.tableName)
      .replace(/\${inputCreateParams}/g, inputCreateParams)
      .replace(/\${createParams}/g, createParams);

    // 写入文件
    fs.appendFile(
      `${config.diskPath}/service/${config.tableName}.ts`,
      resultFile, 'utf8',
      function(err) {
        if (err) {
          throw err;
        }
      },
    );
  }

  /**
   * 生成Dao层TS文件
   */
  async buildDaoTypescriptFile(config: CodeGeneratorConfig) {
    // 获取模版文件，并转换成字符串
    const data = fs.readFileSync(`${localProjectPath}/template/Dao.ftl`);
    const file = data.toString();

    // 获取数据库表名首字母大写格式（示例：TableName）
    const upperCaseTableName = this.upperCaseField(
      config.tableName,
      true,
    );

    // 获取数据库表字段信息
    const columnItems: DBColumnItem[] = await this.getColumnItem(config.tableName);

    // 构建输入参数及创建类参数
    let columnNames = '';
    for (let i = 0; i < columnItems.length; i += 1) {
      const column = columnItems[i];

      columnNames += `  '${column.columnName}',\n`;
    }

    // 去除最后一个换行符
    columnNames = columnNames.substring(0, columnNames.length - 1);

    // 替换模版参数为需要的数据
    const resultFile = file
      .replace(/\${TABLE_NAME}/g, config.tableName.toUpperCase())
      .replace(/\${table_name}/g, config.tableName)
      .replace(/\${columnNames}/g, columnNames)
      .replace(/\${tableAnnotation}/g, config.tableAnnotation)
      .replace(/\${author}/g, config.author)
      .replace(/\${date}/g, moment().format('YYYY-MM-DD'))
      .replace(/\${TableName}/g, upperCaseTableName);

    // 写入文件
    fs.appendFile(
      `${config.diskPath}/dao/${config.tableName}.ts`,
      resultFile, 'utf8',
      function(err) {
        if (err) {
          throw err;
        }
      },
    );
  }

  /**
   * 生成Type层TS文件
   */
  async buildTypeTypescriptFile(config: CodeGeneratorConfig) {
    // 获取模版文件，并转换成字符串
    const data = fs.readFileSync(`${localProjectPath}/template/Type.ftl`);
    const file = data.toString();

    // 获取数据库表名首字母大写格式（示例：TableName）
    const upperCaseTableName = this.upperCaseField(
      config.tableName,
      true,
    );

    // 获取数据库表字段信息
    const columnItems: DBColumnItem[] = await this.getColumnItem(config.tableName);

    // 构建输入参数及创建类参数
    let columnNames = '';
    for (let i = 0; i < columnItems.length; i += 1) {
      const column = columnItems[i];

      columnNames += NumberDataTypes.includes(column.dataType)
        ? `  ${column.columnName}: number;\n`
        : `  ${column.columnName}: string;\n`;
    }

    // 去除最后一个换行符
    columnNames = columnNames.substring(0, columnNames.length - 1);

    // 替换模版参数为需要的数据
    const resultFile = file
      .replace(/\${TableName}/g, upperCaseTableName)
      .replace(/\${columnNames}/g, columnNames);

    // 写入文件
    fs.appendFile(
      `${config.diskPath}/types/${config.tableName}.ts`,
      resultFile, 'utf8',
      function(err) {
        if (err) {
          throw err;
        }
      },
    );
  }

  /**
   * 获取数据库表字段信息 【简单处理，直接在Service层获取数据库表信息】
   * @param tableName 数据库表名
   */
  async getColumnItem(tableName: string): Promise<DBColumnItem[]> {
    const sql = `
      SELECT COLUMN_NAME AS columnName, IS_NULLABLE AS isNullAble,
        DATA_TYPE AS dataType, COLUMN_COMMENT AS columnComment
      FROM information_schema.COLUMNS
      WHERE TABLE_NAME = :tableName;
    `;
    const res = await this.knex.raw(sql, {
      tableName: String(tableName),
    });

    return (res && Array.isArray(res[0])) ? res[0] : [];
  }

  /**
   * 处理数据库表字段 TODO:
   */
  async formatColumnItem(dbColumnItems: DBColumnItem[]) {
    console.log(dbColumnItems);
  }

  /**
   * 将表名转为首字母大写 如 table_name 转换成 TableName / tableName
   * @param tableName 数据库表名
   * @param capitalize 是否首字母大写
   */
  private upperCaseField(tableName: string, capitalize: boolean) {
    const strs = tableName.split('_');

    let resultStr = '';
    for (const item of strs) {
      resultStr += item.slice(0, 1).toUpperCase() + item.slice(1);
    }

    // 非首字母大写则返回小写首字母
    if (!capitalize) {
      resultStr = resultStr.slice(0, 1).toLowerCase() + resultStr.slice(1);
    }

    return resultStr;
  }
}
