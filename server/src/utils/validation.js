const { ZodError } = require('zod');

function formatZodError(error) {
  if (!(error instanceof ZodError)) {
    return null;
  }

  return error.errors.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
}

function validateOrThrow(schema, data, message) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const err = new Error(message || 'Validation error');
    err.status = 400;
    err.details = formatZodError(result.error);
    throw err;
  }
  return result.data;
}

module.exports = { validateOrThrow };
