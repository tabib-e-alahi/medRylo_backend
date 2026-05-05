import { prisma } from "../../lib/prisma";
import { CreateUnitInput, UpdateUnitInput } from "./unit.validation";
import { NotFoundError, ConflictError } from "../../errors/AppError";

export const createUnit = async (data: CreateUnitInput) => {
  const existing = await prisma.unit.findUnique({
    where: { name: data.name },
  });

  if (existing) {
    throw new ConflictError("Unit already exists");
  }

  return await prisma.unit.create({
    data,
  });
};

export const getAllUnits = async (query: {
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
      { symbol: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  const [units, total] = await Promise.all([
    prisma.unit.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.unit.count({ where }),
  ]);

  return {
    units,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getUnitById = async (id: string) => {
  const unit = await prisma.unit.findFirst({
    where: { id, isDeleted: false },
  });

  if (!unit) {
    throw new NotFoundError("Unit not found");
  }

  return unit;
};

export const updateUnit = async (id: string, data: UpdateUnitInput) => {
  await getUnitById(id);

  if (data.name) {
    const existing = await prisma.unit.findFirst({
      where: { name: data.name, id: { not: id } },
    });
    if (existing) throw new ConflictError("Name already in use");
  }

  return await prisma.unit.update({
    where: { id },
    data,
  });
};

export const deleteUnit = async (id: string) => {
  await getUnitById(id);

  return await prisma.unit.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
};
