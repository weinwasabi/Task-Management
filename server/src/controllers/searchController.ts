import { Request, Response } from "express";
import { prisma } from "../db.js";

export const search = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query;
  const term = typeof query === "string" ? query.trim() : "";
  if (term.length < 3 || term.length > 100) {
    res.status(400).json({ message: "query must be 3 to 100 characters" });
    return;
  }

  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { title: { contains: term, mode: "insensitive" } },
          { description: { contains: term, mode: "insensitive" } },
        ],
      },
    });

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: term, mode: "insensitive" } },
          { description: { contains: term, mode: "insensitive" } },
        ],
      },
    });

    const users = await prisma.user.findMany({
      where: {
        OR: [{ username: { contains: term, mode: "insensitive" } }],
      },
    });
    res.json({ tasks, projects, users });
  } catch (error) {
    console.error("Error performing search", error);
    res.status(500).json({ message: "Could not perform search" });
  }
};
