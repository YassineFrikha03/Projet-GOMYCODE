import express from 'express';
import authenticationController from '../controllers/authentication.controller.js';

const router = express.Router();

router.post('/signup', authenticationController.SignUP);
router.post('/login', authenticationController.Login);

export default router;