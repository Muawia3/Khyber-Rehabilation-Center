import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { contentService } from '../services/contentService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getContent = async (req, res, next) => {
  try {
    const { section, key, raw } = req.query;

    if (raw === 'true') {
      const items = await contentService.getAllRawContents({ section });
      return successResponse(res, items, 'Raw site contents retrieved');
    }

    const contents = await contentService.getSiteContents({ section, key });
    return successResponse(res, contents, 'Site contents retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getContentByKey = async (req, res, next) => {
  try {
    const { key } = req.params;
    const contents = await contentService.getSiteContents({ key });
    return successResponse(res, contents[key] || null, 'Content block retrieved');
  } catch (error) {
    next(error);
  }
};

export const upsertContent = async (req, res, next) => {
  try {
    const { key, section, title, content } = req.body;
    if (!key || !key.trim()) {
      return errorResponse(res, 'Content key is required', 400);
    }

    const saved = await contentService.upsertContent({ key, section, title, content });
    return successResponse(res, saved, 'Site content saved successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteContent = async (req, res, next) => {
  try {
    const { key } = req.params;
    await contentService.deleteContent(key);
    return successResponse(res, null, 'Site content deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const uploadImage = async (req, res, next) => {
  try {
    const { image, filename } = req.body;
    if (!image || typeof image !== 'string') {
      return errorResponse(res, 'Image data is required', 400);
    }

    // Match base64 data url e.g. data:image/png;base64,....
    const matches = image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (!matches) {
      if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/')) {
        return successResponse(res, { url: image }, 'Image URL saved');
      }
      return errorResponse(res, 'Invalid base64 image data', 400);
    }

    const extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    const cleanName = (filename ? filename.replace(/[^a-zA-Z0-9_-]/g, '') : 'upload') + '-' + Date.now();
    const finalFilename = `${cleanName}.${extension}`;

    const uploadsDir = path.resolve(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, finalFilename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${finalFilename}`;
    return successResponse(res, { url: publicUrl, filename: finalFilename }, 'Image uploaded successfully');
  } catch (error) {
    next(error);
  }
};
