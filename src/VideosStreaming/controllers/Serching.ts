import { Request, Response } from 'express';
import { videoService } from '../services/postService';

export const getVideoById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const video = await videoService.getVideoById(Number(id));
    res.status(200).json({
      success: true,
      result: video,
      message: `We found this document by this id: ${id}`,
    });
  } catch (error:any) {
    console.error('Error fetching video by ID:', error);
    res.status(500).json({
      success: false,
      result: null,
      message: `Oops, there is an error: ${error.message}`,
    });
  }
};

export const searchVideos = async (req: Request, res: Response): Promise<void> => {
  const query = req.query.q as string;
  const fieldsString = req.query.fields as string;

  if (!query || !fieldsString || query.trim() === '') {
    res.status(202).json({
      success: false,
      result: [],
      message: "No document found by this request",
    });
    return; // Explicitly return void
  }

  const fieldsArray = fieldsString.split(',');

  try {
    const videos = await videoService.searchVideos(query, fieldsArray);

    if (videos.length > 0) {
      res.status(200).json({
        success: true,
        result: videos,
        message: "Successfully found all documents",
      });
    } else {
      res.status(202).json({
        success: false,
        result: [],
        message: "No document found by this request",
      });
    }
  } catch (error:any) {
    console.error('Error searching for videos:', error);
    res.status(500).json({
      success: false,
      result: null,
      message: `Oops, there is an error: ${error.message}`,
    });
  }
  
};
