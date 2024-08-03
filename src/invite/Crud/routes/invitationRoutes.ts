import { Router } from 'express';
import { ensureAuthenticated } from '../../../MiddleWare/UserAuth/VerifyUserAuth';
import invitationController from '../controllers/invitationController';

const router = Router();

// Create an invitation
router.post('/invitations', ensureAuthenticated, invitationController.createInvitation);

// Accept an invitation using the invitation code
router.post('/invitations/accept/:code', ensureAuthenticated, invitationController.acceptInvitation);

router.get('/invitationss', ensureAuthenticated, invitationController.getUserInvitations);


// Get all invitations for the logged-in user
router.get('/invitations', ensureAuthenticated, invitationController.getInvitations);

export default router;
