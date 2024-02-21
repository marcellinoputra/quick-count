export const optionsSwagger = {
  info: {
    version: '1.0.0',
    title: 'Quick Count Api Documentation',
    description: 'Quick Count Api Typescript',
    license: {
      name: 'MIT',
    },
  },
  security: {
    BearerAuth: {
      type: 'http',
      scheme: 'bearer',
    },
  },
  baseDir: __dirname,
  filesPattern: '../../controllers/*.ts',
  swaggerUIPath: '/v1/api-docs',
  exposeSwaggerUI: true,
  exposeApiDocs: false,
  apiDocsPath: '/v3/api-docs',
  notRequiredAsNullable: false,
  swaggerUiOptions: {},
  multiple: true,
};
