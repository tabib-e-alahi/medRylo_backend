import { Request, Response, NextFunction } from "express";
import * as supplierService from "./supplier.service";
import { createSupplierSchema, updateSupplierSchema } from "./supplier.validation";
import { sendSuccess, sendCreated } from "../../utils/sendResponse";

export const createSupplier = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createSupplierSchema.parse(req.body);
    const result = await supplierService.createSupplier(validatedData);
    sendCreated(res, result, "Supplier created successfully");
  } catch (error) {
    next(error);
  }
};

export const getAllSuppliers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      searchTerm: req.query.searchTerm as string,
      sortBy: req.query.sortBy as string,
      sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
      isActive: req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : undefined,
    };

    const { suppliers, meta } = await supplierService.getAllSuppliers(query);
    sendSuccess(res, suppliers, "Suppliers retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
};

export const getSupplierById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await supplierService.getSupplierById(req.params.id);
    sendSuccess(res, result, "Supplier retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const updateSupplier = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = updateSupplierSchema.parse(req.body);
    const result = await supplierService.updateSupplier(req.params.id, validatedData);
    sendSuccess(res, result, "Supplier updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteSupplier = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await supplierService.deleteSupplier(req.params.id);
    sendSuccess(res, null, "Supplier deleted successfully");
  } catch (error) {
    next(error);
  }
};
