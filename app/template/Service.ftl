import { Service, Context } from 'egg';
import * as assert from 'assert';
import ${TableName}Dao from '../dao/TODO/${table_name}';
import { ${TableName}Item } from '../typings/${table_name}';

/**
 * @description ${TableName} 服务层
 * @author ${author}
 * @date ${date}
 */
export default class ${TableName}Service extends Service {
  private ${tableName}Dao: ${TableName}Dao;

  constructor(ctx: Context) {
    super(ctx);
    this.${tableName}Dao = this.ctx.app.dao.TODO.${tableName};
  }

  /**
   * 获取${tableAnnotation}
   * @param id
   */
  async get${TableName}(id: number) {
    assert(id, '缺少参数:id');

    const ${tableName}: ${TableName}Item = await this.${tableName}Dao.get${TableName}(
      id,
    );

    return {
      ${table_name}: ${tableName},
    };
  }

  /**
   * 创建${tableAnnotation}
   */
  async create${TableName}(
${inputCreateParams}
  ) {
    // TODO: 参数校验 assert(, 'TODO');

    let createRes = 0;
    try {
      createRes = await this.${tableName}Dao.create${TableName}({
${createParams}
      });
    } catch (e) {
      // TODO: 异常捕获处理
    }

    const ${tableName}Id = (createRes && createRes[0]) || 0;

    return {
      ${table_name}_id: ${tableName}Id,
    };
  }
}
