const Joi = require('joi');

const printRequestSchema = Joi.object({
  fileUrl: Joi.string()
    .required()
    .uri()
    .message('Invalid file URL'),
  
  printerName: Joi.string()
    .optional(),
  
  settings: Joi.object({
    paperSize: Joi.string()
      .valid('A4', 'Letter', 'Legal')
      .default('A4'),
    
    orientation: Joi.string()
      .valid('portrait', 'landscape')
      .default('portrait'),
    
    copies: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(1)
  }).default({})
});

const validatePrintRequest = (req, res, next) => {
  const { error } = printRequestSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request parameters',
      error: error.details[0].message
    });
  }

  next();
};

module.exports = { validatePrintRequest };
