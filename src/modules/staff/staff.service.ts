import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from "../../errors/AppError";
import { PharmacyStatus, UserAccountStatus, UserRole } from "../../../generated/prisma/enums";
import { CreateStaffInput, StaffQueryInput, UpdateStaffInput } from "./staff.validation";

const staffInclude = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  },
};

async function getApprovedOwnerPharmacy(ownerId: string) {
  const pharmacy = await prisma.pharmacy.findUnique({
    where: { ownerId },
  });

  if (!pharmacy) {
    throw new ForbiddenError("Create a pharmacy profile before managing staff.");
  }

  if (pharmacy.status !== PharmacyStatus.APPROVED) {
    throw new ForbiddenError("Your pharmacy must be approved before managing staff.");
  }

  return pharmacy;
}

export async function createStaff(ownerId: string, data: CreateStaffInput) {
  const pharmacy = await getApprovedOwnerPharmacy(ownerId);

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
    include: { staffProfile: true },
  });

  if (existingUser) {
    throw new ConflictError("A user with this email already exists.");
  }

  const signUpResult = await auth.api.signUpEmail({
    body: {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
    },
    headers: new Headers({
      "x-intended-role": UserRole.STAFF,
    }),
  });

  const userId = signUpResult.user?.id;
  if (!userId) {
    throw new BadRequestError("Unable to create staff account.");
  }

  return prisma.staff.create({
    data: {
      userId,
      pharmacyId: pharmacy.id,
      canManageInventory: data.canManageInventory ?? false,
      canManageSales: data.canManageSales ?? true,
      canManageCustomers: data.canManageCustomers ?? true,
      canViewReports: data.canViewReports ?? false,
      canManagePurchases: data.canManagePurchases ?? false,
    },
    include: staffInclude,
  });
}

export async function getStaffList(ownerId: string, query: StaffQueryInput) {
  const pharmacy = await getApprovedOwnerPharmacy(ownerId);
  const { page = 1, limit = 10, searchTerm, isActive } = query;
  const skip = (page - 1) * limit;

  const where: any = {
    pharmacyId: pharmacy.id,
    isDeleted: false,
  };

  if (isActive !== undefined) where.isActive = isActive;
  if (searchTerm) {
    where.user = {
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { email: { contains: searchTerm, mode: "insensitive" } },
        { phone: { contains: searchTerm, mode: "insensitive" } },
      ],
    };
  }

  const [staff, total] = await Promise.all([
    prisma.staff.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: staffInclude,
    }),
    prisma.staff.count({ where }),
  ]);

  return {
    staff,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function getOwnedStaff(ownerId: string, staffId: string) {
  const pharmacy = await getApprovedOwnerPharmacy(ownerId);
  const staff = await prisma.staff.findFirst({
    where: {
      id: staffId,
      pharmacyId: pharmacy.id,
      isDeleted: false,
    },
    include: staffInclude,
  });

  if (!staff) {
    throw new NotFoundError("Staff member not found.");
  }

  return staff;
}

export async function getStaffById(ownerId: string, staffId: string) {
  return getOwnedStaff(ownerId, staffId);
}

export async function updateStaff(ownerId: string, staffId: string, data: UpdateStaffInput) {
  const staff = await getOwnedStaff(ownerId, staffId);

  await prisma.user.update({
    where: { id: staff.userId },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.phone !== undefined ? { phone: data.phone || null } : {}),
      ...(data.isActive !== undefined ? { status: data.isActive ? UserAccountStatus.ACTIVE : UserAccountStatus.SUSPENDED } : {}),
    },
  });

  return prisma.staff.update({
    where: { id: staffId },
    data: {
      ...(data.canManageInventory !== undefined ? { canManageInventory: data.canManageInventory } : {}),
      ...(data.canManageSales !== undefined ? { canManageSales: data.canManageSales } : {}),
      ...(data.canManageCustomers !== undefined ? { canManageCustomers: data.canManageCustomers } : {}),
      ...(data.canViewReports !== undefined ? { canViewReports: data.canViewReports } : {}),
      ...(data.canManagePurchases !== undefined ? { canManagePurchases: data.canManagePurchases } : {}),
      ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
    },
    include: staffInclude,
  });
}

export async function archiveStaff(ownerId: string, staffId: string) {
  const staff = await getOwnedStaff(ownerId, staffId);

  await prisma.user.update({
    where: { id: staff.userId },
    data: {
      status: UserAccountStatus.SUSPENDED,
    },
  });

  return prisma.staff.update({
    where: { id: staffId },
    data: {
      isActive: false,
      isDeleted: true,
      deletedAt: new Date(),
    },
    include: staffInclude,
  });
}

export async function getMyStaffProfile(userId: string) {
  const staff = await prisma.staff.findUnique({
    where: { userId },
    include: {
      ...staffInclude,
      pharmacy: true,
    },
  });

  if (!staff || staff.isDeleted) {
    throw new NotFoundError("Staff profile not found.");
  }

  return staff;
}
