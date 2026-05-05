import { ForbiddenError, NotFoundError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { CreateCustomerInput, CustomerQueryInput, UpdateCustomerInput } from "./customer.validation";
import { assertStaffPermission, StaffPermission } from "../staff/staff.permission";
import { PharmacyStatus, UserRole } from "../../../generated/prisma/enums";

export async function getApprovedOperationalPharmacyForUser(userId: string, role: UserRole, permission?: StaffPermission) {
  const staffProfile =
    role === UserRole.STAFF
      ? await prisma.staff.findUnique({
          where: { userId },
          include: { pharmacy: true },
        })
      : null;

  if (role === UserRole.STAFF) {
    if (!staffProfile || staffProfile.isDeleted || !staffProfile.isActive) {
      throw new ForbiddenError("This staff account is inactive or not assigned to a pharmacy.");
    }

    if (permission) {
      await assertStaffPermission(userId, permission);
    }
  }

  const pharmacy =
    role === UserRole.STAFF
      ? staffProfile?.pharmacy
      : await prisma.pharmacy.findUnique({
          where: { ownerId: userId },
        });

  if (!pharmacy) {
    throw new ForbiddenError("No pharmacy is assigned to this account.");
  }

  if (pharmacy.status !== PharmacyStatus.APPROVED) {
    throw new ForbiddenError("Your pharmacy must be approved before managing sales.");
  }

  return pharmacy;
}

export async function createCustomer(userId: string, role: UserRole, data: CreateCustomerInput) {
  const pharmacy = await getApprovedOperationalPharmacyForUser(userId, role, "canManageCustomers");

  return prisma.customer.create({
    data: {
      pharmacyId: pharmacy.id,
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      address: data.address || null,
    },
  });
}

export async function getCustomers(userId: string, role: UserRole, query: CustomerQueryInput) {
  const pharmacy = await getApprovedOperationalPharmacyForUser(userId, role, "canManageCustomers");
  const { page = 1, limit = 10, searchTerm, sortBy = "createdAt", sortOrder = "desc" } = query;
  const skip = (page - 1) * limit;

  const where: any = {
    pharmacyId: pharmacy.id,
    isDeleted: false,
  };

  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { phone: { contains: searchTerm, mode: "insensitive" } },
      { email: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.customer.count({ where }),
  ]);

  return {
    customers,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getCustomerById(userId: string, role: UserRole, id: string) {
  const pharmacy = await getApprovedOperationalPharmacyForUser(userId, role, "canManageCustomers");
  const customer = await prisma.customer.findFirst({
    where: {
      id,
      pharmacyId: pharmacy.id,
      isDeleted: false,
    },
  });

  if (!customer) {
    throw new NotFoundError("Customer not found.");
  }

  return customer;
}

export async function updateCustomer(userId: string, role: UserRole, id: string, data: UpdateCustomerInput) {
  await getCustomerById(userId, role, id);

  return prisma.customer.update({
    where: { id },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
      ...(data.email !== undefined ? { email: data.email || null } : {}),
      ...(data.address !== undefined ? { address: data.address || null } : {}),
    },
  });
}

export async function archiveCustomer(userId: string, role: UserRole, id: string) {
  await getCustomerById(userId, role, id);

  return prisma.customer.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
}
