import { Router } from 'express';
import { authUser, deleteUser, getAllUsers, getUser, handleTelegramWebhook, loginUser, logoutUser, searchUsers } from '../handleTelegramCommand/telegramHandlers';
import { ensureAuthenticated } from '../../MiddleWare/UserAuth/VerifyLogin';
import { catchErrors } from '../../Admin/handlers/errorhandler';

const router = Router();
router.post('/webhook', handleTelegramWebhook);
// router.get('/auth', authUser);
router.post('/auth', authUser);
router.get('/login', loginUser);
// 
router.get('/user', ensureAuthenticated, getUser);
router.get('/logout', ensureAuthenticated, logoutUser);
router.get('/client/list', getAllUsers); 
router.get('/client/search', searchUsers);
router.delete('/client/delete/:id', catchErrors,deleteUser);
export default router;