import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { inquiryService } from '../services/inquiryService.js';

export const submitInquiry = async (req, res, next) => {
  try {
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || null;
    const inquiry = await inquiryService.createInquiry(req.body, ipAddress);

    return successResponse(
      res,
      inquiry,
      'Your confidential consultation request has been received. Our clinical intake coordinator will respond shortly.',
      201
    );
  } catch (error) {
    next(error);
  }
};

export const getInquiries = async (req, res, next) => {
  try {
    const { status, search, page, limit } = req.query;
    const result = await inquiryService.getAllInquiries({
      status: status ? status.toUpperCase() : undefined,
      search,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 50,
    });
    return successResponse(res, result, 'Inquiries retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getInquiryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const inquiry = await inquiryService.getInquiryById(id);
    if (!inquiry) {
      return errorResponse(res, 'Inquiry record not found', 404);
    }
    return successResponse(res, inquiry, 'Inquiry details retrieved');
  } catch (error) {
    next(error);
  }
};

export const updateInquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { status, internalNote } = req.body;

    const statusMap = {
      NEW: 'PENDING',
      PENDING: 'PENDING',
      'IN PROGRESS': 'IN_REVIEW',
      IN_PROGRESS: 'IN_REVIEW',
      INPROGRESS: 'IN_REVIEW',
      PROGRESS: 'IN_REVIEW',
      REVIEW: 'IN_REVIEW',
      IN_REVIEW: 'IN_REVIEW',
      CONTACT: 'CONTACTED',
      CONTACTED: 'CONTACTED',
      CLOSE: 'CLOSED',
      CLOSED: 'CLOSED',
      ARCHIVE: 'ARCHIVED',
      ARCHIVED: 'ARCHIVED',
    };

    const normalizedKey = (status || '').toString().trim().toUpperCase();
    if (statusMap[normalizedKey]) {
      status = statusMap[normalizedKey];
    } else {
      status = normalizedKey;
    }

    const allowedStatuses = ['PENDING', 'CONTACTED', 'IN_REVIEW', 'CLOSED', 'ARCHIVED'];
    if (!status || !allowedStatuses.includes(status)) {
      return errorResponse(
        res,
        `Status must be one of: ${allowedStatuses.join(', ')}`,
        422
      );
    }

    const updated = await inquiryService.updateInquiryStatus(id, status, internalNote);
    if (!updated) {
      return errorResponse(res, 'Inquiry record not found or could not be updated', 404);
    }
    return successResponse(res, updated, 'Inquiry status updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    await inquiryService.deleteInquiry(id);
    return successResponse(res, null, 'Inquiry record deleted successfully');
  } catch (error) {
    next(error);
  }
};
