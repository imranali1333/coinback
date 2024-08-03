import { Request, Response } from 'express';
import { videoService } from '../services/postService';

export const postVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, duration, releaseDate, genre, link } = req.body;
    const adminId = req.adminId; // Use adminId from request object
    console.log(adminId)
    if (adminId === undefined) {
      // Handle case where adminId is undefined
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!title || !description || !duration || !genre || !link) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const video = await videoService.createVideo(adminId, title, description, duration, releaseDate, genre, link);

    res.status(201).json({ message: 'Video posted successfully', video });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to post video' });
  }
};
