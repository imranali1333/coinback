// controllers/videoController.ts
import { Request, Response } from 'express';
import { VideoService } from '../services/updateService';

const videoService = new VideoService();

export const videoController = {
  // Existing methods...

  updateVideo: async (req: Request, res: Response): Promise<void> => {
    try {
      const { videoId, adminId, title, description, duration, releaseDate, genre, link } = req.body;

      if (!videoId || !adminId || !title || !description || !duration || !releaseDate || !genre || !link) {
        res.status(400).json({ message: 'All fields are required' });
        return;
      }

      const video = await videoService.updateVideo(videoId, adminId, title, description, duration, new Date(releaseDate), genre, link);

      res.status(200).json({ message: 'Video updated successfully', video });
    } catch (error:any) {
      console.error('Error in updateVideo:', error);
      res.status(500).json({ message: `Failed to update video: ${error.message}` });
    }
  },

  deleteVideo: async (req: Request, res: Response): Promise<void> => {
    try {
      const { videoId } = req.body;
      if (!videoId) {
        res.status(400).json({ message: 'Video ID is required' });
        return;
      }
      const result = await videoService.deleteVideo(videoId);
      res.status(200).json(result);
    } catch (error:any) {
      console.error('Error in deleteVideo:', error);
      res.status(500).json({ message: `Failed to delete video: ${error.message}` });
    }
  }
};
