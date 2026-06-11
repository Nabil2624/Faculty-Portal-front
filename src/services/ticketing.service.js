import axiosInstance from "../utils/axiosInstance";

export const TICKET_TYPES = [
  "AccountIssue",
  "FacultyMemberPersonalDataIssue",
  "FacultyMemberContributionsDataIssue",
  "FacultyMemberExperincesDataIssue",
  "FacultyMemberHigherStudiesDataIssue",
  "FacultyMemberMissionsDataIssue",
  "FacultyMemberPrizesDataIssue",
  "FacultyMemberProjectsAndComiteesDataIssue",
  "FacultyMemberResearchesDataIssue",
  "FacultyMemberScientificProgressionDataIssue",
  "FacultyMemberWritingsDataIssue",
  "PermissionRequest",
  "RoleAssignmentRequest",
];

export const TICKET_PRIORITIES = [
  "Unspecified",
  "Low",
  "Medium",
  "High",
  "Critical",
];

export const TICKET_STATUSES = [
  "Opened",
  "InProgress",
  "Resolved",
  "Reopened",
  "Closed",
  "WithdrawByUser",
];

export const TICKET_SORTS = [
  "TitleASC",
  "TitleDESC",
  "DescriptionASC",
  "DescriptionDESC",
  "CreatedAtASC",
  "CreatedAtDESC",
];

export async function getMyTickets({
  search = "",
  sort = "",
  type = "",
  status = "",
  priority = "",
  pageIndex = 1,
  pageSize = 10,
} = {}) {
  const params = {
    PageIndex: pageIndex, // backend wants the page index to start from 1
    PageSize: pageSize,
    ...(search && { Search: search }),
    ...(sort && { Sort: sort }),
    ...(type && { Type: type }),
    ...(status && { Status: status }),
    ...(priority && { Priority: priority }),
  };
  const res = await axiosInstance.get("/Ticketing/Ticket/FacultyMember", {
    params,
  });
  return res.data;
}

export async function createTicket({ title, description, type, priority }) {
  const res = await axiosInstance.post("/Ticketing/Ticket", {
    title,
    description,
    type,
    priority,
  });
  return res.data;
}

export async function revokeTicket(ticketId) {
  const res = await axiosInstance.put(`/Ticketing/Ticket/Revoke/${ticketId}`);
  return res.data;
}

export async function reopenTicket(ticketId) {
  const res = await axiosInstance.put(`/Ticketing/Ticket/Reopen/${ticketId}`);
  return res.data;
}

// ─── Management Admin endpoints ───────────────────────────────────────────────

export async function getAllTickets({
  search = "",
  sort = "",
  type = "",
  status = "",
  priority = "",
  pageIndex = 1,
  pageSize = 10,
  skipGlobalErrorHandler = false,
} = {}) {
  const params = {
    PageIndex: pageIndex,
    PageSize: pageSize,
    ...(search && { Search: search }),
    ...(sort && { Sort: sort }),
    ...(type && { Type: type }),
    ...(status && { Status: status }),
    ...(priority && { Priority: priority }),
  };
  const res = await axiosInstance.get("/Ticketing/Ticket", {
    params,
    skipGlobalErrorHandler,
  });
  return res.data;
}

export async function getSuitableSupportAdmins(
  type,
  { skipGlobalErrorHandler = false } = {},
) {
  const res = await axiosInstance.get(
    "/Ticketing/Ticket/SuitableSupportAdmins",
    {
      params: { type },
      skipGlobalErrorHandler,
    },
  );
  return res.data;
}

export async function assignTicket(
  ticketId,
  body,
  { skipGlobalErrorHandler = false } = {},
) {
  const res = await axiosInstance.put(
    `/Ticketing/Ticket/Assign/${ticketId}`,
    body,
    {
      skipGlobalErrorHandler,
    },
  );
  return res.data;
}

export async function closeTicketAdmin(
  ticketId,
  { skipGlobalErrorHandler = false } = {},
) {
  const res = await axiosInstance.put(
    `/Ticketing/Ticket/Close/${ticketId}`,
    undefined,
    {
      skipGlobalErrorHandler,
    },
  );
  return res.data;
}

export async function deleteTicket(
  ticketId,
  { skipGlobalErrorHandler = false } = {},
) {
  const res = await axiosInstance.delete(`/Ticketing/Ticket/${ticketId}`, {
    skipGlobalErrorHandler,
  });
  return res.data;
}

// ─── Support Admin endpoints ──────────────────────────────────────────────────

export async function getSupportAdminTickets({
  search = "",
  sort = "",
  type = "",
  status = "",
  priority = "",
  pageIndex = 1,
  pageSize = 10,
} = {}) {
  const params = {
    PageIndex: pageIndex,
    PageSize: pageSize,
    ...(search && { Search: search }),
    ...(sort && { Sort: sort }),
    ...(type && { Type: type }),
    ...(status && { Status: status }),
    ...(priority && { Priority: priority }),
  };
  const res = await axiosInstance.get("/Ticketing/Ticket/SupportAdmin", {
    params,
  });
  return res.data;
}

export async function resolveTicket(ticketId) {
  const res = await axiosInstance.put(`/Ticketing/Ticket/Resolve/${ticketId}`);
  return res.data;
}
