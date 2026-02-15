import axiosInstance from "../utils/axiosInstance";

export const getParticipationJournals = (pageIndex, pageSize) => {
  return axiosInstance.get(
    "/ProjectsAndCommittees/ParticipationInMagazines",
    {
      params: { pageIndex, pageSize },
      skipGlobalErrorHandler: true,
    }
  );
};

export const deleteParticipationJournal = (id) => {
  return axiosInstance.delete(
    `/ProjectsAndCommittees/DeleteParticipationInMagazine/${id}`,
    { skipGlobalErrorHandler: true }
  );
};
export const getJournalParticipationRoles = async () => {
  const { data } = await axiosInstance.get(
    "/LookUpItems/MagazineParticipationRoles",
    { skipGlobalErrorHandler: true }
  );
  return data || [];
};

export const createParticipationInMagazine = async (payload) => {
  return axiosInstance.post(
    "/ProjectsAndCommittees/CreateParticipationInMagazine",
    payload,
    { skipGlobalErrorHandler: true }
  );
};
export const updateParticipationJournal = async (id, payload) => {
  return axiosInstance.put(
    `/ProjectsAndCommittees/UpdateParticipationInMagazine/${id}`,
    payload,
    { skipGlobalErrorHandler: true }
  );
};