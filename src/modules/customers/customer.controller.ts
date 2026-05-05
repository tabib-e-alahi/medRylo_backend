import { Request, Response, NextFunction } from "express";
import { sendCreated, sendSuccess } from "../../utils/sendResponse";
import * as customerService from "./customer.service";
import { createCustomerSchema, customerQuerySchema, updateCustomerSchema } from "./customer.validation";
import { UserRole } from "../../constant/enum";

export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = createCustomerSchema.parse(req.body);
    const result = await customerService.createCustomer(req.user.id, req.user.role as UserRole, payload);
    sendCreated(res, result, "Customer created successfully");
  } catch (error) {
    next(error);
  }
};

export const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = customerQuerySchema.parse(req.query);
    const { customers, meta } = await customerService.getCustomers(req.user.id, req.user.role as UserRole, query);
    sendSuccess(res, customers, "Customers retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await customerService.getCustomerById(req.user.id, req.user.role as UserRole, String(req.params.id));
    sendSuccess(res, result, "Customer retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = updateCustomerSchema.parse(req.body);
    const result = await customerService.updateCustomer(req.user.id, req.user.role as UserRole, String(req.params.id), payload);
    sendSuccess(res, result, "Customer updated successfully");
  } catch (error) {
    next(error);
  }
};

export const archiveCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await customerService.archiveCustomer(req.user.id, req.user.role as UserRole, String(req.params.id));
    sendSuccess(res, result, "Customer archived successfully");
  } catch (error) {
    next(error);
  }
};
