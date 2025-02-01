class TimeEntryScheme {
    create = {
        type: 'object',
        properties: {
            employeeId: {
                type: 'string',
                maxLength: 60,
                minLength: 1,
                nullable: false
            },
            startTime: {
                type: 'string',
                format: 'date-time',
                nullable: false
            },
            endTime: {
                type: 'string',
                format: 'date-time',
                nullable: false
            },
            description: {
                type: 'string',
                nullable: false
            },
        },
        required: ['employeeId', 'startTime', 'endTime', 'description'],
        additionalProperties: false
    };

    get = {
        type: 'object',
        properties: {
            employeeId: {
                type: 'string',
                maxLength: 60,
                minLength: 1,
                nullable: false
            },
            date: {
                type: 'string',
                format: 'date',
                nullable: false
            },
        },
        additionalProperties: false
    };

    edit = {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                maxLength: 60,
                minLength: 1,
                nullable: false
            },
            startTime: {
                type: 'string',
                format: 'date-time',
                nullable: false
            },
            endTime: {
                type: 'string',
                format: 'date-time',
                nullable: false
            },
            description: {
                type: 'string',
                nullable: false
            },
        },
        required: ['id', 'startTime', 'endTime', 'description'],
        additionalProperties: false
    };

    delete = {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                maxLength: 60,
                minLength: 1,
                nullable: false
            },
        },
        required: ['id'],
        additionalProperties: false
    };
}

export default TimeEntryScheme;