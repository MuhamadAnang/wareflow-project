import "server-only";

import env from "@/common/config/environtment";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { TIndexQueryParams } from "@/types/query-params";
import { paginationResponseMapper } from "@/lib/pagination";
import { TActionApprovalUser, TCreateOrUpdateClerkUserSchema } from "@/schemas/clerk.schema";
import { BadRequestException } from "@/common/exception/bad-request.exception";
import { NotFoundException } from "@/common/exception/not-found.exception";

export const clerkAuthenticateRequestService = async (req: NextRequest) => {
  const client = await clerkClient();

  const { toAuth } = await client.authenticateRequest(req, {
    jwtKey: env.CLERK_JWT_KEY,
  });

  return toAuth();
};

export const getClerkUsersService = async (queryParams: TIndexQueryParams) => {
  const client = await clerkClient();

  const page = Number(queryParams.page) || 1;
  const pageSize = Number(queryParams.pageSize) || 10;

  const { data, totalCount } = await client.users.getUserList({
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  return paginationResponseMapper(data, {
    currentPage: page,
    pageSize: pageSize,
    totalItems: totalCount,
  });
};

export const getClerkUserByIdService = async (id: string) => {
  const client = await clerkClient();

  const user = await client.users.getUser(id);

  return user;
};

export const approveOrRejectClerkUserService = async (id: string, payload: TActionApprovalUser) => {
  const client = await clerkClient();

  const { action } = payload;

  if (action === "approve") {
    return await client.users.updateUser(id, {
      publicMetadata: {
        isAllowed: true,
      },
    });
  } else if (action === "reject") {
    return await client.users.updateUser(id, {
      publicMetadata: {
        isAllowed: false,
      },
    });
  }
};

export const createClerkUserService = async (payload: TCreateOrUpdateClerkUserSchema) => {
  const client = await clerkClient();

  const existingUsers = await client.users.getUserList({
    emailAddress: [payload.emailAddress],
    limit: 1,
  });

  if (existingUsers.data.length > 0) {
    throw new BadRequestException("Email sudah digunakan oleh pengguna lain.");
  }

  const user = await client.users.createUser({
    emailAddress: [payload.emailAddress],
    firstName: payload.firstName,
    lastName: payload.lastName,

    publicMetadata: {
      isAllowed: true,
    },

    skipPasswordRequirement: true,
    skipPasswordChecks: true,

    legalAcceptedAt: new Date(),
  });

  const email = user.emailAddresses[0];

  await client.emailAddresses.updateEmailAddress(email.id, {
    verified: true,
    primary: true,
  });

  return await client.users.getUser(user.id);
};

export const updateClerkUserService = async (
  id: string,
  payload: TCreateOrUpdateClerkUserSchema,
) => {
  const client = await clerkClient();

  const user = await client.users.getUser(id);

  const currentEmail = user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId);

  if (payload.emailAddress && payload.emailAddress !== currentEmail?.emailAddress) {
    const existingUsers = await client.users.getUserList({
      emailAddress: [payload.emailAddress],
      limit: 1,
    });

    const emailUsedByAnotherUser = existingUsers.data.length > 0 && existingUsers.data[0].id !== id;

    if (emailUsedByAnotherUser) {
      throw new BadRequestException("Email sudah digunakan oleh pengguna lain.");
    }
  }

  await client.users.updateUser(id, {
    firstName: payload.firstName,
    lastName: payload.lastName,
  });

  if (payload.emailAddress && payload.emailAddress !== currentEmail?.emailAddress) {
    const newEmail = await client.emailAddresses.createEmailAddress({
      userId: id,
      emailAddress: payload.emailAddress,
    });

    await client.emailAddresses.updateEmailAddress(newEmail.id, {
      verified: true,
      primary: true,
    });

    if (currentEmail) {
      await client.emailAddresses.deleteEmailAddress(currentEmail.id);
    }
  }

  return await client.users.getUser(id);
};

export const deleteClerkUserService = async (id: string) => {
  const client = await clerkClient();

  const user = await client.users.getUser(id);

  if (!user) {
    throw new NotFoundException("Pengguna tidak ditemukan.");
  }

  return await client.users.deleteUser(id);
};
