import { prisma } from "../../lib/prisma";
import { CreateMedicineInput, UpdateMedicineInput } from "./medicine.validation";
import { NotFoundError } from "../../errors/AppError";
import { deleteFromCloudinary, deleteFromCloudinaryByPublicId } from "../../utils/claudinary";

export const createMedicine = async (data: any) => {
  return await prisma.medicine.create({
    data,
    include: {
      category: true,
      type: true,
      supplier: true,
      unit: true,
      leafSetting: true,
    }
  });
};

export const getAllMedicines = async (query: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  categoryId?: string;
  typeId?: string;
  supplierId?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  const {
    page = 1,
    limit = 10,
    searchTerm,
    categoryId,
    typeId,
    supplierId,
    status,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const skip = (page - 1) * limit;

  const where: any = {
    isDeleted: false,
  };

  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { genericName: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  if (categoryId) where.categoryId = categoryId;
  if (typeId) where.typeId = typeId;
  if (supplierId) where.supplierId = supplierId;
  if (status) where.status = status;

  const [medicines, total] = await Promise.all([
    prisma.medicine.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        category: true,
        type: true,
        supplier: true,
        unit: true,
        leafSetting: true,
      }
    }),
    prisma.medicine.count({ where }),
  ]);

  return {
    medicines,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getMedicineById = async (id: string) => {
  const medicine = await prisma.medicine.findFirst({
    where: { id, isDeleted: false },
    include: {
      category: true,
      type: true,
      supplier: true,
      unit: true,
      leafSetting: true,
    }
  });

  if (!medicine) {
    throw new NotFoundError("Medicine not found");
  }

  return medicine;
};

export const updateMedicine = async (id: string, data: any) => {
  const medicine = await getMedicineById(id);

  // If a new image is provided and there was an old one, delete the old one
  if ("image" in data && medicine.image && data.image !== medicine.image) {
    await deleteFromCloudinaryByPublicId(medicine.imagePublicId);
    if (!medicine.imagePublicId) {
      await deleteFromCloudinary(medicine.image);
    }
  }

  return await prisma.medicine.update({
    where: { id },
    data,
    include: {
      category: true,
      type: true,
      supplier: true,
      unit: true,
      leafSetting: true,
    }
  });
};

export const deleteMedicine = async (id: string) => {
  const medicine = await getMedicineById(id);

  // Soft delete
  const result = await prisma.medicine.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  // Optionally delete image from cloudinary on soft delete
  if (medicine.image) {
    await deleteFromCloudinaryByPublicId(medicine.imagePublicId);
    if (!medicine.imagePublicId) {
      await deleteFromCloudinary(medicine.image);
    }
  }

  return result;
};
