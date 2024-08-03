// src/controllers/videoController.ts

import { Request, Response } from 'express';
import { VideoService } from '../services/postService';

const videoService = new VideoService();

export const deleteVideo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedVideo = await videoService.deleteVideo(Number(id));
    res.status(200).json({
      success: true,
      result: deletedVideo,
      message: `Successfully deleted document by this id: ${id}`,
    });
  } catch (error:any) {
    console.error('Error deleting video:', error);
    if (error.message.includes('Failed to delete video')) {
      res.status(404).json({
        success: false,
        result: null,
        message: `No document found with id: ${id}`,
      });
    } else {
      res.status(500).json({
        success: false,
        result: null,
        message: `Oops, there is an error: ${error.message}`,
      });
    }
  }
};
