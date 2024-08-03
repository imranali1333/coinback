import { Request, Response } from 'express';
import invitationService, { Errors, InvitatedUserTrytoAcceptedException } from '../services/invitationService';
import {
  InvitationNotFoundError,
  InvitationAlreadyAcceptedException,
  InvitationExpiredError,
  UserNotInvitedError,
  InvitedBySameAsUserError,
  GenericInvitationError,
  InternalServerError,
} from '../services/invitationService';
interface CustomRequest extends Request {
  user?: {
    id: any; // Replace with the actual user type
  };
}

class InvitationController {
  // Create an invitation
  async createInvitation(req: Request, res: Response): Promise<void> {
    try {
      // Ensure the user is logged in
      if (!req.session.loggedIn || !req.session.userId) {
        res.status(401).json({ message: 'Unauthorized: User not logged in' });
        return;
      }
      const invitedById = req.session.userId;

      // Create an invitation
      const invitation = await invitationService.createInvitation(invitedById);

      // Respond with the invitation details
      res.status(201).json({
        message: 'Invitation created successfully',
        code: invitation.code, // Return the invitation code
        expiresAt: invitation.expiresAt, // Optional: Return the expiration date if needed
      });
    } catch (error: any) {
      console.error('Error creating invitation:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
    // Accept an invitation using the invitation code
    async acceptInvitation(req: CustomRequest, res: Response): Promise<void> {
      try {
        const { code } = req.params;
        const userId = req.session.userId;
    
        if (!userId) {
          res.status(401).json({ message: 'Unauthorized: User not logged in' });
          return;
        }
    
        const invitation = await invitationService.acceptInvitation(code, userId);
    
        res.status(200).json({
          message: 'Invitation accepted successfully',
          invitation,
        });
      } catch (error) {
        console.error('Error accepting invitation:', error);
    
        let statusCode = 500;
        let errorMessage = 'Internal Server Error';
    
        if (error instanceof InvitationNotFoundError) {
          statusCode = 404;
          errorMessage = 'Invitation not found';
        } else if (error instanceof InvitationAlreadyAcceptedException) {
          statusCode = 400;
          errorMessage = 'Invitation has already been accepted';
          
        } 
        else if (error instanceof InvitatedUserTrytoAcceptedException) {
          statusCode = 400;
          errorMessage = 'Invitation has already been accepted';
          
        } 
        else if (error instanceof InvitationExpiredError) {
          statusCode = 400;
          errorMessage = 'Invitation has expired';
        } else if (error instanceof UserNotInvitedError) {
          statusCode = 403;
          errorMessage = 'Only the invited user can accept this invitation';
        } else if (error instanceof InvitedBySameAsUserError) {
          statusCode = 400;
          errorMessage = 'Invalid operation: invitedById cannot be the same as invitedUserId';
        } else if (error instanceof GenericInvitationError) {
          statusCode = 500;
          errorMessage = 'An error occurred while accepting the invitation';
        }
    
        res.status(statusCode).json({ message: errorMessage });
      }
    }
    
    // Get all invitations for a user
  async getInvitations(req: Request, res: Response): Promise<void> {
    try {
      // Ensure the user is logged in
      if (!req.session.loggedIn || !req.session.userId) {
        res.status(401).json({ message: 'Unauthorized: User not logged in' });
        return;
      }

      const userId = req.session.userId;

      // Fetch the invitations
      const invitations = await invitationService.getInvitationsByUser(userId);

      // Respond with the list of invitations
      res.status(200).json(invitations);
    } catch (error: any) {
      console.error('Error fetching invitations:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  async getUserInvitations(req: CustomRequest, res: Response): Promise<void> {
    try {
      const userId = req.session.userId;
  
      // Check if user is logged in
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized: User not logged in' });
        return;
      }
  
      // Fetch the invitations for the logged-in user
      const invitations = await invitationService.getUserInvitations(userId);
  
      res.status(200).json({
        message: 'Invitations retrieved successfully',
        invitations,
      });
    } catch (error) {
      console.error('Error retrieving user invitations:', error);
  
      let statusCode = 500;
      let errorMessage = 'Internal Server Error';
  
      if (error instanceof GenericInvitationError) {
        statusCode = 500;
        errorMessage = 'An error occurred while retrieving user invitations';
      }
  
      res.status(statusCode).json({ message: errorMessage });
    }
  }
  
}
export default new InvitationController();
