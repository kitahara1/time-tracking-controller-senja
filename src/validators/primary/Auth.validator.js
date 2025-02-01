class AuthScheme {
  register = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        maxLength: 60,
        minLength: 1,
        nullable: false
      },
      username: {
        type: 'string',
        maxLength: 60,
        minLength: 1,
        nullable: false
      },
      password: {
        type: 'string',
        minLength: 6,
        maxLength: 18,
        pattern: '^\\S+$',
        nullable: false
      }
    },
    required: ['name', 'username', 'password'],
    additionalProperties: false
  };
  login = {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        nullable: false
      },
      password: {
        type: 'string',
        nullable: false
      }
    },
    required: ['username', 'password'],
    additionalProperties: false
  };
}

export default AuthScheme;