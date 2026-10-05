const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'CRUD Usuários JWT',
    version: '1.0.0'
  },
  servers: [
    {
      url: 'http://localhost:3000'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      Usuario: {
        type: 'object',
        properties: {
          nome: {
            type: 'string'
          },
          email: {
            type: 'string'
          },
          senha: {
            type: 'string'
          },
          role: {
            type: 'string',
            enum: ['medico', 'paciente', 'admin']
          },
          crm: {
            type: 'string',
            description: 'Obrigatório para médicos'
          },
          especialidade: {
            type: 'string',
            description: 'Obrigatória para médicos'
          },
          cpf: {
            type: 'string',
            description: 'Obrigatório para pacientes'
          }
        }
      },
      Login: {
        type: 'object',
        properties: {
          email: {
            type: 'string'
          },
          senha: {
            type: 'string'
          }
        }
      }
    }
  },
  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Cadastra médico ou paciente',
        tags: ['Autenticação'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Usuario'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Usuário cadastrado'
          }
        }
      }
    },
    '/api/auth/login': {
      post: {
        summary: 'Realiza login',
        tags: ['Autenticação'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Login'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Login realizado'
          }
        }
      }
    },
    '/api/users': {
      get: {
        summary: 'Lista usuários',
        tags: ['Usuários'],
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          200: {
            description: 'Lista de usuários'
          }
        }
      },
      post: {
        summary: 'Cria usuário',
        tags: ['Usuários'],
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Usuario'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Usuário criado'
          }
        }
      }
    },
    '/api/users/{id}': {
      get: {
        summary: 'Busca usuário por id',
        tags: ['Usuários'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'Usuário encontrado'
          }
        }
      },
      put: {
        summary: 'Atualiza usuário',
        tags: ['Usuários'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Usuario'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Usuário atualizado'
          }
        }
      },
      delete: {
        summary: 'Remove usuário',
        tags: ['Usuários'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'Usuário removido'
          }
        }
      }
    }
  }
}

module.exports = swaggerSpec
