import express from 'express';
import { handleGetBalance, handleUpdateBalance } from '../Contrllers/allCoinsController';
import { ensureAuthenticated } from '../../MiddleWare/UserAuth/VerifyUserAuth';

const router = express.Router();

// Update coins balance route
// for testing
// {

//   "incrementAmount": 100
// }
router.post('/updateBalance', ensureAuthenticated, handleUpdateBalance);

// Get coins balance route
router.get('/getBalance', ensureAuthenticated, handleGetBalance);

export default router;
