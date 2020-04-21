// This file is created by egg-ts-helper@1.25.7
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCodeGeneratorController from '../../../app/controller/CodeGeneratorController';
import ExportHome from '../../../app/controller/home';

declare module 'egg' {
  interface IController {
    codeGeneratorController: ExportCodeGeneratorController;
    home: ExportHome;
  }
}
