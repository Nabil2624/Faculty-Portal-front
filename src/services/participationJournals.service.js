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
