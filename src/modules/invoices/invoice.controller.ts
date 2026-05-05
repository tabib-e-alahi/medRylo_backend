import { Request, Response, NextFunction } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { sendCreated, sendSuccess } from "../../utils/sendResponse";
import * as invoiceService from "./invoice.service";
import { createInvoiceSchema, createPaymentSchema, invoiceQuerySchema } from "./invoice.validation";

export const createInvoice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = createInvoiceSchema.parse(req.body);
    const result = await invoiceService.createInvoice(req.user.id, req.user.role as UserRole, payload);
    sendCreated(res, result, "Invoice created successfully");
  } catch (error) {
    next(error);
  }
};

export const getInvoices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = invoiceQuerySchema.parse(req.query);
    const { invoices, meta } = await invoiceService.getInvoices(req.user.id, req.user.role as UserRole, query);
    sendSuccess(res, invoices, "Invoices retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
};

export const getInvoiceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await invoiceService.getInvoiceById(req.user.id, req.user.role as UserRole, String(req.params.id));
    sendSuccess(res, result, "Invoice retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const createPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = createPaymentSchema.parse(req.body);
    const result = await invoiceService.createPayment(req.user.id, req.user.role as UserRole, String(req.params.id), payload);
    sendCreated(res, result, "Payment recorded successfully");
  } catch (error) {
    next(error);
  }
};

export const getInvoicePayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { payments, summary } = await invoiceService.getInvoicePayments(req.user.id, req.user.role as UserRole, String(req.params.id));
    sendSuccess(res, { payments, summary }, "Payments retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const cancelInvoice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await invoiceService.cancelInvoice(req.user.id, req.user.role as UserRole, String(req.params.id));
    sendSuccess(res, result, "Invoice cancelled successfully");
  } catch (error) {
    next(error);
  }
};
