import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export interface ApiError {
  success: boolean;
  message: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  members?: { userId: number; username: string; profilePictureUrl: string }[];
  tasks?: Task[];
}

export enum Priority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
  Urgent = "Urgent",
  Backlog = "Backlog",
}

export enum Status {
  ToDo = "To Do",
  WorkInProgress = "Work In Progress",
  UnderReview = "Under Review",
  Completed = "Completed",
}
enum Role {
  MEMBER = "MEMBER",
  ADMIN = "ADMIN",
}

export interface User {
  userId: number;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  role: Role;
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpiresAt?: Date;

  profilePictureUrl?: string;
  teamId?: number;
}

export interface Attachment {
  id: number;
  fileURL: string;
  fileName: string;
  taskId: number;
  uploadedById: number;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string;
  startDate?: string;
  dueDate?: string;
  progress?: number;
  projectId: number;
  authorUserId?: number;
  assignedUserId?: number;

  author?: User;
  assignee?: User;
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface SearchResults {
  tasks?: Task[];
  projects?: Project[];
  users?: User[];
}

export interface Team {
  id: number;
  teamName: string;
  productOwnerUserId?: number;
  projectManagerUserId?: number;
}

export interface searchResult {
  tasks?: Task[];
  projects?: Project[];
  users?: User[];
}

export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface SignupRequset {
  username: string;
  email: string;
  password: string;
}
export interface SignupResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface CheckAuthResponse {
  success: boolean;
  user: User;
}
export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface ForgetPasswordRes {
  success: boolean;
  message: string;
  code: string;
}
export interface ForgetPasswordReq {
  email: string;
}
export interface VerifyResetPasswordRes {
  success: boolean;
  message: string;
}
export interface VerifyResetPasswordReq {
  code: string;
}
export interface ResetPasswordRes {
  success: boolean;
  message: string;
}
export interface ResetPasswordReq {
  code: string;
  newPassword: string;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include", // Include credentials (cookies) in requests
  }),
  tagTypes: ["Project", "Task", "User", "Team", "Auth"],
  endpoints: (builder) => ({
    //Projects//
    getProjects: builder.query<Project[], void>({
      query: () => "projects",
      providesTags: ["Project"],
    }),

    getProjectById: builder.query<Project, string>({
      query: (projectId) => `projects/${projectId}`,
      providesTags: (result, error, projectId) => [
        { type: "Project", id: projectId },
      ],
    }),

    getProjectsByUserId: builder.query<
      { success: boolean; projects: Project[] },
      void
    >({
      query: () => "projects/getProjectsByUserId",
      providesTags: ["Project"],
    }),

    createProject: builder.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: "projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Project"],
    }),
    //Tasks//
    getTasks: builder.query<Task[], { projectId: number }>({
      query: ({ projectId }) => `tasks?projectId=${projectId}`,
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "Task" as const, id }))
          : [{ type: "Task" as const }],
    }),

    getTasksByUser: builder.query<Task[], number>({
      query: (userId) => `tasks/user/${userId}`,
      providesTags: (result, error, userId) =>
        result
          ? result.map(({ id }) => ({ type: "Task" as const, id }))
          : [{ type: "Task" as const, id: userId }],
    }),

    createTask: builder.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: "tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Task"],
    }),

    updateTaskStatus: builder.mutation<
      Task,
      { taskId: number; status: string }
    >({
      query: ({ taskId, status }) => ({
        url: `tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Task", id: taskId },
      ],
    }),
    // Users
    getUsers: builder.query<User[], void>({
      query: () => "users",
      providesTags: ["User"],
    }),
    getUserById: builder.query<{ success: boolean; user: User }, void>({
      query: () => "users/profile",
      providesTags: ["User"],
    }),
    // Teams
    getTeams: builder.query<Team[], void>({
      query: () => "teams",
      providesTags: ["Team"],
    }),
    search: builder.query<searchResult, string>({
      query: (query) => `search?query=${query}`,
    }),
    //Auth
    signup: builder.mutation<SignupResponse, SignupRequset>({
      query: (data) => ({
        url: "auth/signup",
        method: "POST",
        body: data,
      }),
    }),

    vaerifyEmail: builder.mutation<
      { success: boolean; message: string },
      { code: string }
    >({
      query: (body) => ({
        url: "auth/verify-email",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: "auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth", "Project", "Task", "Team", "User"],
    }),

    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    forgetPassword: builder.mutation<ForgetPasswordRes, ForgetPasswordReq>({
      query: (body) => ({
        url: "auth/forgetPassword",
        method: "POST",
        body,
      }),
    }),

    verifyResetPassowrd: builder.mutation<
      VerifyResetPasswordRes,
      VerifyResetPasswordReq
    >({
      query: (body) => ({
        url: "auth/verify-reset-password",
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation<ResetPasswordRes, ResetPasswordReq>({
      query: (body) => ({
        url: "auth/resetPassword",
        method: "POST",
        body,
      }),
    }),

    checkAuth: builder.query<CheckAuthResponse, void>({
      query: () => "auth/checkAuth",
      providesTags: ["Auth"],
    }),
  }),
});

export const {
  //Projects
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useGetProjectsByUserIdQuery,
  //Tasks
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useGetTasksByUserQuery,
  //Search
  useSearchQuery,
  //Users
  useGetUsersQuery,
  useGetUserByIdQuery,
  //Teams
  useGetTeamsQuery,
  //Auth
  useSignupMutation,
  useVaerifyEmailMutation,
  useLoginMutation,
  useLogoutMutation,
  useForgetPasswordMutation,
  useVerifyResetPassowrdMutation,
  useResetPasswordMutation,
  useCheckAuthQuery,
} = api;

//!!
// providesTags: (result) =>
//   result
//     ? [
//         { type: "Tasks" as const, id: "LIST" },
//         ...result.map(({ id }) => ({ type: "Tasks" as const, id })),
//       ]
//     : [{ type: "Tasks" as const, id: "LIST" }];
