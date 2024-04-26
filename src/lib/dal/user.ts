import type { User } from "@prisma/client";
import { getPrisma } from "../prisma";
import { Argon2id } from "oslo/password";
import sharp from "sharp";
import { createCollections } from "./collections";
import { nanoid } from "../nanoid";

// MARK: Auth
/** Use @see{validateUsername} and @see{validatePassword} to validate your parameters. */
export async function validateUser(username: Username, password: Password) {
  await using connection = getPrisma();
  const client = connection.prisma;

  const existingUser = await client.user.findFirst({ where: { username } });
  if (!existingUser) {
    throw new Error("Username or password incorrect.");
  }

  const validPassword = await new Argon2id().verify(
    existingUser.hashedPassword,
    password,
  );

  if (!validPassword) {
    throw new Error("Username or password incorrect.");
  }

  return existingUser;
}

// MARK: Collections
export async function createDefaultCollections(user: User) {
  await createCollections(
    user,
    {
      publicId: nanoid(),
      name: "General",
      visibility: "public",
      isCustom: false,
    },
    {
      publicId: nanoid(),
      name: "Liked",
      visibility: "public",
      isCustom: false,
    },
  );
}

// MARK: Preferences
export async function createDefaultPreferences(userId: User["id"]) {
  await using connection = getPrisma();
  const client = connection.prisma;

  await client.appPreferences.create({ data: { userId } });
  await client.collectionPreferences.create({ data: { userId } });
  await client.recipePreferences.create({ data: { userId } });
}

// MARK: Password
export async function changePassword(
  sessionId: string,
  currentPassword: string,
  newPassword: string,
) {
  await using connection = getPrisma();
  const client = connection.prisma;

  const session = await client.session.findFirst({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!session || !(await equalsPassword(session.user, currentPassword)))
    return;

  await client.user.update({
    where: { id: sessionId },
    data: { hashedPassword: await new Argon2id().hash(newPassword) },
  });
}

async function equalsPassword(user: User, currentPassword: string) {
  return await new Argon2id().verify(
    user?.hashedPassword ?? "",
    currentPassword,
  );
}

export type Password = string & { __brand: "ValidPassword" };

const passwordRange = { min: 6, max: 255 } as const;
export function validatePassword(password: any): password is Password {
  if (typeof password !== "string") {
    throw new TypeError("Password needs to be a string.");
  }

  if (
    password.length < passwordRange.min ||
    password.length > passwordRange.max
  ) {
    throw new RangeError(
      `Password needs to be between ${passwordRange.min} and ${passwordRange.max} characters long. Received ${password.length} characters`,
      {
        cause: {
          ...passwordRange,
          actual: password.length,
        },
      },
    );
  }

  return true;
}

// MARK: Avatar
export async function changeAvatar(sessionId: string, image: File) {
  await using connection = getPrisma();
  const client = connection.prisma;

  const session = await client.session.findFirst({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!session) return;

  const buffer = await sharp(await image.arrayBuffer())
    .resize(200, 200)
    .toBuffer();

  await client.user.update({
    where: { id: session?.user.id },
    data: {
      imgSrc: `data:${image.type};base64,${buffer.toString("base64")}`,
    },
  });
}

// MARK: Username
export async function changeUsername(sessionId: string, newUsername: Username) {
  await using connection = getPrisma();
  const client = connection.prisma;

  const session = await client.session.findFirst({
    where: { id: sessionId },
    include: { user: true },
  });

  // TODO: consider whether username should be unique, or some sort of discriminator system should be present.
  if (!session) return;

  await client.user.update({
    where: { id: session?.user.id },
    data: {
      username: newUsername,
    },
  });
}

export type Username = string & { brand: "ValidUsername" };

const usernameRanges = { min: 3, max: 31 } as const;
export function validateUsername(username: any): username is Username | never {
  if (typeof username !== "string") {
    throw new TypeError("Username needs to be a string.");
  }

  if (
    username.length < passwordRange.min ||
    username.length > passwordRange.max
  ) {
    throw new RangeError(
      `Username needs to be between ${usernameRanges.min} and ${usernameRanges.max} characters long. Received ${username.length} characters`,
      {
        cause: {
          ...usernameRanges,
          actual: username.length,
        },
      },
    );
  }

  if (!/^[a-z0-9_-]+$/.test(username))
    throw new TypeError("Username doesn't match required pattern.");

  return true;
}
