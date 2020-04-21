import { Application } from 'egg';

const v1 = route => `/api/1${route.replace(/^\/*/, '/')}`;
export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);
  router.post(v1('/code_generator'), controller.codeGeneratorController.codeGenerator);
};
