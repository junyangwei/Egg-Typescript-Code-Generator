const { knex } = require('../../schema/database');

const TABLE_${TABLE_NAME} = '${table_name}';

const ${TABLE_NAME} = [
${columnNames}
];

// 定义返回数据格式枚举类型
export enum ReturnDataType {
  OBJECT = 0,
  ARRAY = 1,
}

/**
* @description ${tableAnnotation} Dao层
* @author ${author}
* @date ${date}
*/
export default class ${TableName}Dao {

  /**
   * 创建${tableAnnotation}
   * @param params
   */
  async create${TableName}(params: any) {
    return knex(TABLE_${TABLE_NAME}).insert(params);
  }

  /**
   * 获取${tableAnnotation}
   * @param id
   */
  async get${TableName}(id: number) {
    if (!id) return null;

    const sql = `
      SELECT ${${TABLE_NAME}}
      FROM ${TABLE_${TABLE_NAME}}
      WHERE id = :id
      AND status = 1;
    `;

    const res = await knex.raw(sql, {
      id: Number(id) || 0,
    });

    return this.returnData(res, ReturnDataType.OBJECT);
  }

  // 定义返回数据格式(仅限sql获取，GraphQL不适用)
  private returnData(res: any, type: number) {
    if (type === ReturnDataType.OBJECT) {
      if (res && res[0] && Array.isArray(res[0]) && res[0][0]) {
        return res[0][0];
      }
      return null;
    }
    if (type === ReturnDataType.ARRAY) {
      if (res && res[0] && Array.isArray(res[0])) {
        return res[0];
      }
      return [];
    }
  }
}
