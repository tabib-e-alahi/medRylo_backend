import { Request, Response, NextFunction } from "express";
import { sendCreated, sendSuccess } from "../../utils/sendResponse";
import { UserRole } from "../../../generated/prisma/enums";
import * as inventoryService from "./inventory.service";
import {
  createInventorySchema,
  globalMedicineQuerySchema,
  inventoryQuerySchema,
  updateInventorySchema,
} from "./inventory.validation";

export const getGlobalMedicines = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = globalMedicineQuerySchema.parse(req.query);
    const { medicines, meta } = await inventoryService.getGlobalMedicinesForInventory(query);
    sendSuccess(res, medicines, "Global medicines retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
};

export const createInventoryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = createInventorySchema.parse(req.body);
    const result = await inventoryService.createInventoryItem(req.user.id, payload, req.user.role as UserRole);
    sendCreated(res, result, "Inventory item added successfully");
  } catch (error) {
    next(error);
  }
};

export const getInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = inventoryQuerySchema.parse(req.query);
    const { items, meta } = await inventoryService.getInventory(req.user.id, query, req.user.role as UserRole);
    sendSuccess(res, items, "Inventory retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
};

export const getInventoryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await inventoryService.getInventoryItem(req.user.id, String(req.params.id), req.user.role as UserRole);
    sendSuccess(res, result, "Inventory item retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const updateInventoryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = updateInventorySchema.parse(req.body);
    const result = await inventoryService.updateInventoryItem(req.user.id, String(req.params.id), payload, req.user.role as UserRole);
    sendSuccess(res, result, "Inventory item updated successfully");
  } catch (error) {
    next(error);
  }
};

export const archiveInventoryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await inventoryService.archiveInventoryItem(req.user.id, String(req.params.id), req.user.role as UserRole);
    sendSuccess(res, result, "Inventory item archived successfully");
  } catch (error) {
    next(error);
  }
};
