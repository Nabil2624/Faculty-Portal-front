import axiosInstance from "../utils/axiosInstance";
import qs from "qs";
const BASE_URL = "/ProjectsAndCommittees";

export const getCommitteesAndAssociations = async ({
  pageIndex,
  pageSize,
  search,
  DegreeOfSubscriptionIds,
  TypeOfCommitteeOrAssociationIds,
  sort,
}) => {
  const response = await axiosInstance.get(
    `${BASE_URL}/CommitteesAndAssociations`,
    {
      params: {
        pageIndex,
        pageSize,
        search,
        ...(sort && { sort }),
        ...(DegreeOfSubscriptionIds?.length && { DegreeOfSubscriptionIds }),
        ...(TypeOfCommitteeOrAssociationIds?.length && { TypeOfCommitteeOrAssociationIds }),
      },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
      skipGlobalErrorHandler: true,
      skipGlobalErrorHandler: true,
    },
  );

  return response.data;
};

export const deleteCommitteeOrAssociation = async (id) => {
  await axiosInstance.delete(`${BASE_URL}/DeleteCommitteeOrAssociation/${id}`, {
    skipGlobalErrorHandler: true,
  });
};

export const getCommitteeLookups = () =>
  Promise.all([
    axiosInstance.get("/LookUpItems/TypesofCommittee", {
      skipGlobalErrorHandler: true,
    }),
    axiosInstance.get("/LookUpItems/CommitteeParticipationDegrees", {
      skipGlobalErrorHandler: true,
    }),
  ]);

export const updateCommittee = (id, payload) =>
  axiosInstance.put(
    `/ProjectsAndCommittees/UpdateCommitteeOrAssociation/${id}`,
    payload,
    { skipGlobalErrorHandler: true },
  );
export const createCommittee = async (data) => {
  const response = await axiosInstance.post(
    "/ProjectsAndCommittees/CreateCommitteeOrAssociation",
    data,
    { skipGlobalErrorHandler: true },
  );
  return response.data;
};
