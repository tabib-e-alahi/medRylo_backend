import { prisma } from "../../lib/prisma";
import { CreateLeafSettingInput, UpdateLeafSettingInput } from "./leaf-setting.validation";
import { NotFoundError, ConflictError } from "../../errors/AppError";

export const createLeafSetting = async (data: CreateLeafSettingInput) => {
  const existing = await prisma.leafSetting.findUnique({
    where: { name: data.name },
  });

  if (existing) {
    throw new ConflictError("Leaf setting with this name already exists");
  }

  return await prisma.leafSetting.create({
    data,
  });
};

export const getAllLeafSettings = async (query: {
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

  const [leafSettings, total] = await Promise.all([
    prisma.leafSetting.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.leafSetting.count({ where }),
  ]);

  return {
    leafSettings,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getLeafSettingById = async (id: string) => {
  const leafSetting = await prisma.leafSetting.findFirst({
    where: { id, isDeleted: false },
  });

  if (!leafSetting) {
    throw new NotFoundError("Leaf setting not found");
  }

  return leafSetting;
};

export const updateLeafSetting = async (id: string, data: UpdateLeafSettingInput) => {
  await getLeafSettingById(id);

  if (data.name) {
    const existing = await prisma.leafSetting.findFirst({
      where: { name: data.name, id: { not: id } },
    });
    if (existing) throw new ConflictError("Name already in use");
  }

  return await prisma.leafSetting.update({
    where: { id },
    data,
  });
};

export const deleteLeafSetting = async (id: string) => {
  await getLeafSettingById(id);

  return await prisma.leafSetting.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
};
