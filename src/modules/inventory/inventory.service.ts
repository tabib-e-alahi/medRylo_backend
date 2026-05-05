import { prisma } from "../../lib/prisma";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../../errors/AppError";
import {
  MedicineStatus,
  PharmacyInventoryStatus,
  PharmacyStatus,
  UserRole,
} from "../../../generated/prisma/enums";
import { assertStaffPermission } from "../staff/staff.permission";
import {
  CreateInventoryInput,
  GlobalMedicineQueryInput,
  InventoryQueryInput,
  UpdateInventoryInput,
} from "./inventory.validation";

const EXPIRING_SOON_DAYS = 30;

const inventoryInclude = {
  medicine: {
    include: {
      category: true,
      type: true,
      unit: true,
      supplier: true,
    },
  },
};

export async function getApprovedPharmacyForUser(userId: string, role: UserRole = UserRole.PHARMACY, requireManage = true) {
  const staffProfile =
    role === UserRole.STAFF
      ? await prisma.staff.findUnique({ where: { userId }, include: { pharmacy: true } })
      : null;

  if (role === UserRole.STAFF) {
    if (requireManage) await assertStaffPermission(userId, "canManageInventory");
    if (!staffProfile || staffProfile.isDeleted || !staffProfile.isActive) {
      throw new ForbiddenError("This staff account is inactive or not assigned to a pharmacy.");
    }
  }

  const pharmacy =
    role === UserRole.STAFF
      ? staffProfile?.pharmacy
      : await prisma.pharmacy.findUnique({
          where: { ownerId: userId },
        });

  if (!pharmacy) {
    throw new ForbiddenError("Create a pharmacy profile before managing inventory.");
  }

  if (pharmacy.status !== PharmacyStatus.APPROVED) {
    throw new ForbiddenError("Your pharmacy must be approved before managing inventory.");
  }

  return pharmacy;
}

const withInventoryFlags = <T extends { stockQuantity: number; lowStockAlertQuantity: number; expiryDate: Date | null }>(
  item: T
) => {
  const now = new Date();
  const expiringSoonDate = new Date(now);
  expiringSoonDate.setDate(now.getDate() + EXPIRING_SOON_DAYS);

  return {
    ...item,
    isLowStock: item.stockQuantity <= item.lowStockAlertQuantity,
    isExpiringSoon:
      item.expiryDate !== null &&
      item.expiryDate >= now &&
      item.expiryDate <= expiringSoonDate,
  };
};

const normalizeDate = (date?: string) => {
  if (!date) return undefined;
  return new Date(date);
};

export async function getGlobalMedicinesForInventory(query: GlobalMedicineQueryInput) {
  const {
    page = 1,
    limit = 10,
    searchTerm,
    categoryId,
    typeId,
    sortBy = "name",
    sortOrder = "asc",
  } = query;
  const skip = (page - 1) * limit;

  const where: any = {
    isDeleted: false,
    status: MedicineStatus.ACTIVE,
  };

  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { genericName: { contains: searchTerm, mode: "insensitive" } },
      { strength: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  if (categoryId) where.categoryId = categoryId;
  if (typeId) where.typeId = typeId;

  const [medicines, total] = await Promise.all([
    prisma.medicine.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        category: true,
        type: true,
        unit: true,
        supplier: true,
      },
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
}

export async function createInventoryItem(userId: string, data: CreateInventoryInput, role: UserRole = UserRole.PHARMACY) {
  const pharmacy = await getApprovedPharmacyForUser(userId, role, true);

  const medicine = await prisma.medicine.findFirst({
    where: {
      id: data.medicineId,
      isDeleted: false,
      status: MedicineStatus.ACTIVE,
    },
  });

  if (!medicine) {
    throw new NotFoundError("Active global medicine not found.");
  }

  const duplicate = await prisma.pharmacyInventory.findFirst({
    where: {
      pharmacyId: pharmacy.id,
      medicineId: data.medicineId,
      batchNumber: data.batchNumber || null,
      status: { not: PharmacyInventoryStatus.ARCHIVED },
    },
  });

  if (duplicate) {
    throw new ConflictError("This medicine batch already exists in your inventory.");
  }

  const createData: any = {
    pharmacyId: pharmacy.id,
    medicineId: data.medicineId,
    batchNumber: data.batchNumber || null,
    stockQuantity: data.stockQuantity,
    sellingPrice: data.sellingPrice,
    purchasePrice: data.purchasePrice ?? null,
    shelf: data.shelf || null,
    lowStockAlertQuantity: data.lowStockAlertQuantity ?? 10,
    status: data.status ?? PharmacyInventoryStatus.ACTIVE,
  };

  const expiryDate = normalizeDate(data.expiryDate);
  if (expiryDate) createData.expiryDate = expiryDate;

  return prisma.pharmacyInventory.create({
    data: createData,
    include: inventoryInclude,
  }).then(withInventoryFlags);
}

export async function getInventory(userId: string, query: InventoryQueryInput, role: UserRole = UserRole.PHARMACY) {
  const pharmacy = await getApprovedPharmacyForUser(userId, role, false);
  const {
    page = 1,
    limit = 10,
    searchTerm,
    categoryId,
    status,
    lowStock,
    expiringSoon,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;
  const skip = (page - 1) * limit;

  const where: any = {
    pharmacyId: pharmacy.id,
    status: status ?? { not: PharmacyInventoryStatus.ARCHIVED },
  };

  if (lowStock) {
    where.stockQuantity = { lte: prisma.pharmacyInventory.fields.lowStockAlertQuantity };
  }

  if (expiringSoon) {
    const now = new Date();
    const until = new Date(now);
    until.setDate(now.getDate() + EXPIRING_SOON_DAYS);
    where.expiryDate = {
      gte: now,
      lte: until,
    };
  }

  if (searchTerm || categoryId) {
    where.medicine = {
      isDeleted: false,
      ...(categoryId ? { categoryId } : {}),
      ...(searchTerm
        ? {
            OR: [
              { name: { contains: searchTerm, mode: "insensitive" } },
              { genericName: { contains: searchTerm, mode: "insensitive" } },
              { strength: { contains: searchTerm, mode: "insensitive" } },
            ],
          }
        : {}),
    };
  }

  const orderBy =
    sortBy === "medicineName"
      ? { medicine: { name: sortOrder } }
      : { [sortBy]: sortOrder };

  const [items, total] = await Promise.all([
    prisma.pharmacyInventory.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: inventoryInclude,
    }),
    prisma.pharmacyInventory.count({ where }),
  ]);

  return {
    items: items.map(withInventoryFlags),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getInventoryItem(userId: string, id: string, role: UserRole = UserRole.PHARMACY) {
  const pharmacy = await getApprovedPharmacyForUser(userId, role, false);
  const item = await prisma.pharmacyInventory.findFirst({
    where: {
      id,
      pharmacyId: pharmacy.id,
    },
    include: inventoryInclude,
  });

  if (!item) {
    throw new NotFoundError("Inventory item not found.");
  }

  return withInventoryFlags(item);
}

export async function updateInventoryItem(userId: string, id: string, data: UpdateInventoryInput, role: UserRole = UserRole.PHARMACY) {
  await getApprovedPharmacyForUser(userId, role, true);
  const existing = await getInventoryItem(userId, id, role);

  if (existing.status === PharmacyInventoryStatus.ARCHIVED) {
    throw new BadRequestError("Archived inventory items cannot be updated.");
  }

  if (data.medicineId && data.medicineId !== existing.medicineId) {
    const medicine = await prisma.medicine.findFirst({
      where: {
        id: data.medicineId,
        isDeleted: false,
        status: MedicineStatus.ACTIVE,
      },
    });

    if (!medicine) {
      throw new NotFoundError("Active global medicine not found.");
    }
  }

  const updateData: any = {
    ...data,
  };

  if ("expiryDate" in updateData) {
    updateData.expiryDate = normalizeDate(data.expiryDate);
  }

  if (updateData.batchNumber === "") updateData.batchNumber = null;
  if (updateData.shelf === "") updateData.shelf = null;

  return prisma.pharmacyInventory.update({
    where: { id },
    data: updateData,
    include: inventoryInclude,
  }).then(withInventoryFlags);
}

export async function archiveInventoryItem(userId: string, id: string, role: UserRole = UserRole.PHARMACY) {
  await getApprovedPharmacyForUser(userId, role, true);
  const item = await getInventoryItem(userId, id, role);

  if (item.status === PharmacyInventoryStatus.ARCHIVED) {
    return item;
  }

  return prisma.pharmacyInventory.update({
    where: { id },
    data: {
      status: PharmacyInventoryStatus.ARCHIVED,
    },
    include: inventoryInclude,
  }).then(withInventoryFlags);
}
