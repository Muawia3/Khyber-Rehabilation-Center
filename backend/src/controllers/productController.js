import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { productService } from '../services/productService.js';

export const getProducts = async (req, res, next) => {
  try {
    const { category, all } = req.query;
    const isAllRequested = all === 'true';

    const products = isAllRequested
      ? await productService.getAllProducts({ category })
      : await productService.getPublishedProducts({ category });

    return successResponse(res, products, 'Products retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductByIdOrSlug(id);

    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    return successResponse(res, product, 'Product details retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return errorResponse(res, 'Product name is required', 400);
    }

    const product = await productService.createProduct(req.body);
    return successResponse(res, product, 'Product created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.updateProduct(id, req.body);
    return successResponse(res, product, 'Product updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await productService.deleteProduct(id);
    return successResponse(res, null, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
};
