export interface CodeGeneratorConfig {
  // 作者
  author: string;
  // 数据库表名
  tableName: string;
  // 数据库表名注释
  tableAnnotation: string;
  // 数据库连接配置
  dbConnectConfig: DBConnectConfig;
  // 代码生成主目录 如 xxx/egg-code-generator/app
  diskPath: string;
}

export interface DBConnectConfig {
  // 数据库连接地址
  dbHost: string;
  // 数据库连接端口
  dbPort: string;
  // 数据库连接用户名
  dbUser: string;
  // 数据库连接密码
  dbPassword: string;
  // 数据库
  dbName: string;
}

export interface DBColumnItem {
  columnName: string;
  isNullAble: string;
  dataType: DataTypes;
  columnComment: string;
  camelCaseColumnName?: string;
}

// 数据库字段类型
export enum DataTypes {
  // INT类型
  Int = 'int',
  TinyInt = 'tinyint',
  SmallInt = 'smallint',
  MediumInt = 'mediumint',
  BigInt = 'bigint',
  // FLOAT、DOUBLE 和 DECIMAL 类型
  Float = 'float',
  Double = 'double',
  Decimal = 'decimal',
  // 字符串类型
  Char = 'char',
  Varchar = 'varchar',
  TinyBlob = 'tinyblob',
  TinyText = 'tinytext',
  Blob = 'blob',
  Text = 'text',
  MediumBlob = 'mediumblob',
  MediumText = 'mediumText',
  LongBlob = 'longblob',
  LongText = 'longtext',
  // 日期
  Date = 'date',
  Time = 'time',
  Year = 'year',
  DateTime = 'datetime',
  TimeStamp = 'timestamp',
}

