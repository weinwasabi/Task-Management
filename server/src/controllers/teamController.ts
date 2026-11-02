import { Request, Response } from "express";
import { prisma } from "../db.js";

export const getTeams = async (_req: Request, res: Response): Promise<void> => {
  try {
    const teams = await prisma.team.findMany();
    const userIds = [
      ...new Set(
        teams.flatMap((team) =>
          [team.productOwnerUserId, team.projectManagerUserId].filter(
            (id): id is number => id !== null,
          ),
        ),
      ),
    ];
    const users = await prisma.user.findMany({
      where: { userId: { in: userIds } },
      select: { userId: true, username: true },
    });
    const usernames = new Map(users.map((user) => [user.userId, user.username]));

    res.json(
      teams.map((team) => ({
        ...team,
        productOwnerUsername:
          team.productOwnerUserId === null
            ? null
            : (usernames.get(team.productOwnerUserId) ?? null),
        projectManagerUsername:
          team.projectManagerUserId === null
            ? null
            : (usernames.get(team.projectManagerUserId) ?? null),
      })),
    );
  } catch (error) {
    console.error("Error retrieving teams", error);
    res.status(500).json({ message: "Could not retrieve teams" });
  }
};
