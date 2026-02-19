import axiosInstance from "../utils/axiosInstance";

/* ================== LIST ================== */
export const getProjects = (pageIndex, pageSize, search) => {
  return axiosInstance.get("/ProjectsAndCommittees/Projects", {
    params: { pageIndex, pageSize, search },
    skipGlobalErrorHandler: true,
  });
};

/* ================== DELETE ================== */
export const deleteProject = (id) => {
  return axiosInstance.delete(`/ProjectsAndCommittees/DeleteProject/${id}`, {
    skipGlobalErrorHandler: true,
  });
};

/* ================== SERVICE ================== */
export const projectService = {
  /* -------- Lookups -------- */
  fetchProjectTypes: async () => {
    const res = await axiosInstance.get("/LookUpItems/ProjectTypes", {
      skipGlobalErrorHandler: true,
    });
    return (res.data || []).filter((x) => x != null);
  },

  fetchProjectRoles: async () => {
    const res = await axiosInstance.get("/LookUpItems/ProjectRoles", {
      skipGlobalErrorHandler: true,
    });
    return (res.data || []).filter((x) => x != null);
  },

  /* -------- Create -------- */
  createProject: async (payload) => {
    await axiosInstance.post("/ProjectsAndCommittees/CreateProject", payload, {
      skipGlobalErrorHandler: true,
    });
  },

  /* -------- Update (الإضافة المطلوبة) -------- */
  updateProject: async (id, payload) => {
    await axiosInstance.put(
      `/ProjectsAndCommittees/UpdateProject/${id}`,
      payload,
      { skipGlobalErrorHandler: true },
    );
  },
};
