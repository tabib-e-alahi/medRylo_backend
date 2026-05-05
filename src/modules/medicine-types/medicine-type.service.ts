import { prisma } from "../../lib/prisma";
import { CreateMedicineTypeInput, UpdateMedicineTypeInput } from "./medicine-type.validation";
import { NotFoundError, ConflictError } from "../../errors/AppError";

export const createMedicineType = async (data: CreateMedicineTypeInput) => {
  const existing = await prisma.medicineType.findUnique({
    where: { name: data.name },
  });

  if (existing) {
    throw new ConflictError("Medicine Type already exists");
  }

  return await prisma.medicineType.create({
    data,
  });
};

export const getAllMedicineTypes = async (query: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isActive?: boolean;
}) => {
  const {
    page = 1,
    limit = 10,
    searchTerm,
    sortBy = "createdAt",
    sortOrder = "desc",
    isActive,
  } = query;

  const skip = (page - 1) * limit;

  const where: any = {
    isDeleted: false,
  };

  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  const [medicineTypes, total] = await Promise.all([
    prisma.medicineType.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.medicineType.count({ where }),
  ]);

  return {
    medicineTypes,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getMedicineTypeById = async (id: string) => {
  const medicineType = await prisma.medicineType.findFirst({
    where: { id, isDeleted: false },
  });

  if (!medicineType) {
    throw new NotFoundError("Medicine Type not found");
  }

  return medicineType;
};

export const updateMedicineType = async (id: string, data: UpdateMedicineTypeInput) => {
  await getMedicineTypeById(id);

  if (data.name) {
    const existing = await prisma.medicineType.findFirst({
      where: { name: data.name, id: { not: id } },
    });
    if (existing) throw new ConflictError("Name already in use");
  }

  return await prisma.medicineType.update({
    where: { id },
    data,
  });
};

export const deleteMedicineType = async (id: string) => {
  await getMedicineTypeById(id);

  return await prisma.medicineType.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
};
