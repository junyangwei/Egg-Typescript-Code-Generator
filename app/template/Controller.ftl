
import { Controller } from 'egg';

/**
 * @description ${TableName} 控制层
 * @author ${author}
 * @date ${date}
 */
export default class ${TableName}Controller extends Controller {
  /**
   * @api {get} /api/1/{TODO: 自填}/get 获取${tableAnnotation}
   * @apiVersion 1.0.0
   * @apiName get
   * @apiGroup {TODO: 自填}
   * @apiPermission {TODO: 自填}
   * @apiDescription 获取${tableAnnotation} 作者: ${author}
   * @apiParam {number} id ${tableAnnotation}id【必须】
   */
  async get${TableName}() {
    const { ctx, service } = this;
    const { id } = ctx.query;

    const result = await service.TODO.${tableName}.get${TableName}(
      Number(id) || 0,
    );
    ctx.success(result);
  }

  /**
   * @api {post} /api/1/{TODO: 自填}/create 创建${tableAnnotation}
   * @apiVersion 1.0.0
   * @apiName create
   * @apiGroup {TODO: 自填}
   * @apiPermission {TODO: 自填}
   * @apiDescription 创建${tableAnnotation} 作者: ${author}
   */
  async create${TableName}() {
    const { ctx, service } = this;
    const {
${inputCreateParams}
    } = ctx.request.body;

    const result = await service.TODO.${tableName}.create${TableName}(
${createParams}
    );
    ctx.success(result);
  }
}
