# Egg-Typescript-Code-Generator

egg typescript code generator

## QuickStart

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

Don't tsc compile at development mode, if you had run `tsc` then you need to `npm run clean` before `npm run dev`.

### Deploy

```bash
$ npm run tsc
$ npm start
```

### Npm Scripts

- Use `npm run lint` to check code style
- Use `npm test` to run unit test
- se `npm run clean` to clean compiled js at development mode once

### Requirement

- Node.js 8.x
- Typescript 2.8+

### How To Use
```bash
$ npm run dev
```

```call interface
POST    /api/1/code_generator
Reuqest Body:
{
    "author": "UncleYang",
    "table_name": "your_table_name",
    "table_annotation": "your_table_annotation",
    "db_host": "Your database host",
    "db_port": "Your database port",
    "db_user": "Your database user",
    "db_password": "Your database password",
    "db_name": "Your database name",
    "disk_path": "Your project main path which need to code generate"
}
```
