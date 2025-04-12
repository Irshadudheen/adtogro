import { body } from "express-validator"

const createAdValidate = [ body('companyName').notEmpty().withMessage('Company name is required'),
    body('companyWebsite').notEmpty().withMessage('Company website is required')
    .matches(/^(https?:\/\/)?([\w\-]+\.)+[\w\-]{2,}(\/\S*)?$/).withMessage('Invalid URL format'),
    body('contactName').notEmpty().withMessage('Contact name is required'),
    body('contactEmail').notEmpty().withMessage('Contact email is required'),
    body('contactPhone').notEmpty().withMessage('Contact phone is required'),
    body('adDescription').notEmpty().withMessage('Ad description is required'),
    body('adImage').notEmpty().withMessage('Ad image is required'),
    body('advertisPlan').notEmpty().withMessage('Advertis plan is required')]
export {createAdValidate}