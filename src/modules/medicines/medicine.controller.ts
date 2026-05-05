import { Request, Response, NextFunction } from "express";
import * as medicineService from "./medicine.service";
import { createMedicineSchema, updateMedicineSchema } from "./medicine.validation";
import { sendSuccess, sendCreated } from "../../utils/sendResponse";
import { uploadImage } from "../uploads/upload.service";
import { BadRequestError } from "../../errors/AppError";

const getParamId = (req: Request) => {
  const id = req.params.id;
  if (!id || Array.isArray(id)) throw new BadRequestError("Medicine id is required");
  return id;
};

export const createMedicine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createMedicineSchema.parse(req.body);
    const uploadedImage = await uploadImage(req.file, "medicine");
    
    const data = {
      ...validatedData,
      image: uploadedImage?.secureUrl || null,
      imagePublicId: uploadedImage?.publicId || null,
      expiryDate: validatedData.expiryDate ? new Date(validatedData.expiryDate) : null,
    };

    const result = await medicineService.createMedicine(data);
    sendCreated(res, result, "Medicine created successfully");
  } catch (error) {
    next(error);
  }
};

export const getAllMedicines = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      searchTerm: req.query.searchTerm as string,
      categoryId: req.query.categoryId as string,
      typeId: req.query.typeId as string,
      supplierId: req.query.supplierId as string,
      status: req.query.status as string,
      sortBy: req.query.sortBy as string,
      sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
    };

    const { medicines, meta } = await medicineService.getAllMedicines(query);
    sendSuccess(res, medicines, "Medicines retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
};

export const getMedicineById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await medicineService.getMedicineById(getParamId(req));
    sendSuccess(res, result, "Medicine retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const updateMedicine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = updateMedicineSchema.parse(req.body);
    
    const data: any = {
      ...validatedData,
    };

    if (req.file) {
      const uploadedImage = await uploadImage(req.file, "medicine");
      data.image = uploadedImage?.secureUrl || null;
      data.imagePublicId = uploadedImage?.publicId || null;
    } else if (validatedData.removeImage) {
      data.image = null;
      data.imagePublicId = null;
    }

    delete data.removeImage;
    
    if (validatedData.expiryDate) {
      data.expiryDate = new Date(validatedData.expiryDate);
    } else if (validatedData.expiryDate === "") {
      data.expiryDate = null;
    }

    const result = await medicineService.updateMedicine(getParamId(req), data);
    sendSuccess(res, result, "Medicine updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteMedicine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await medicineService.deleteMedicine(getParamId(req));
    sendSuccess(res, null, "Medicine deleted successfully");
  } catch (error) {
    next(error);
  }
};
