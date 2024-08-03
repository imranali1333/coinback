// src/controllers/videoController.ts

import { Request, Response } from 'express';
import { VideoService } from '../services/postService';

const videoService = new VideoService();

export const updateVideo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updateData = req.body; // Data to update

  try {
    const video = await videoService.updateVideo(Number(id), updateData);
    res.status(200).json({
      success: true,
      result: video,
      message: `We updated this document by this id: ${id}`,
    });
  } catch (error:any) {
    console.error('Error updating video:', error);
    if (error.message.includes('Failed to update video')) {
      res.status(400).json({
        success: false,
        result: null,
        message: "Required fields are not supplied or invalid data provided",
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
