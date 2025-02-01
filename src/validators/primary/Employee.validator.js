class EmployeeScheme {
  register = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        maxLength: 60,
        minLength: 1,
        nullable: false
      },
      email: {
        type: 'string',
        format: 'email',
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
        maxLength: 60,
        minLength: 1,
        nullable: false
      },
      role: {
        type: 'string',
        enum: ['admin', 'employee']
      },
    },
    required: ['name', 'email', 'role'],
    additionalProperties: false
  };
}

export default EmployeeScheme;