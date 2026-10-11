import { prisma } from "../../../prisma/prisma.js";
import type { Request, Response } from "express";

export const getProjectById = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const id = Number(projectId);
  try {
    if (!projectId || !Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }
    const project = await prisma.project.findUnique({
      where: { id },
    });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }
    res.json({ success: true, project });
  } catch (error: any) {
    res.status(500).json({ message: `Failed to fetch project` });
  }
};

export const getProjectsByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await prisma.user.findUnique({
      where: { userId },
      select: { teamId: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.teamId) {
      return res.status(200).json({
        success: true,
        projects: [],
      });
    }

    const projects = await prisma.project.findMany({
      where: {
        projectTeams: {
          some: {
            teamId: user.teamId,
          },
        },
      },
      include: {
        tasks: true,
        projectTeams: {
          include: {
            team: {
              include: {
                user: {
                  select: {
                    userId: true,
                    username: true,
                    profilePictureUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const projectsWithMembersAndTasks = projects.map((project) => {
      const membersMap = new Map();
      project.projectTeams.forEach((projectTeam) => {
        projectTeam.team.user.forEach((user) => {
          membersMap.set(user.userId, user);
        });
      });
      const members = Array.from(membersMap.values());
      return {
        id: project.id,
        name: project.name,
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate,
        tasks: project.tasks,
        members,
      };
    });

    return res.status(200).json({
      success: true,
      projects: projectsWithMembersAndTasks,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        tasks: true,
        projectTeams: {
          include: {
            team: {
              include: {
                user: {
                  select: {
                    userId: true,
                    username: true,
                    profilePictureUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const projectsWithMembersAndTasks = projects.map((project) => {
      const membersMap = new Map();
      project.projectTeams.forEach((projectTeam) => {
        projectTeam.team.user.forEach((user) => {
          membersMap.set(user.userId, user);
        });
      });
      const members = Array.from(membersMap.values());

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate,
        tasks: project.tasks,
        members,
      };
    });
    return res.json(projectsWithMembersAndTasks);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving projects: ${error.message}` });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description, startDate, endDate } = req.body;
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        startDate,
        endDate,
      },
    });
    res.status(201).json(newProject);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating a project: ${error.message}` });
  }
};

//!
// SELECT setval(
//     pg_get_serial_sequence('"Project"', 'id'),
//     (SELECT MAX(id) FROM "Project")
// );

// `SELECT setval(pg_get_serial_sequence('"[DATA_MODEL_NAME_HERE]"', 'id'), coalesce(max(id)+1, 1), false) FROM "[DATA_MODEL_NAME_HERE]";`
