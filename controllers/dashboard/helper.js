const moment = require("moment/moment");

const handleJobMapping = (jobs, interestedJobIds, mapView) => {
  return mapView === "true"
    ? jobs.map(
        ({
          _id,
          jobTitle,
          createdAt,
          companyInfo,
          positionInfo,
          employmentType,
          jobFilledStatus,
        }) => {
          return {
            jobTitle,
            createdAt,
            jobId: _id,
            employmentType,
            jobFilledStatus,
            img: positionInfo?.image,
            salary: positionInfo?.salary,
            currency: positionInfo?.currency,
            homeBase: positionInfo?.homeBase,
            companyName: companyInfo?.companyName,
            companyType: companyInfo?.companyType,
            currentlyLocated: positionInfo?.currentlyLocated,
          };
        }
      )
    : jobs.map(
        ({
          _id,
          jobTitle,
          createdAt,
          companyInfo,
          positionInfo,
          employmentType,
          jobFilledStatus,
        }) => {
          return {
            createdAt,
            jobId: _id,
            jobFilledStatus,
            img: positionInfo?.image,
            jobTitle,
            ...(interestedJobIds?.length > 0 && {
              interested: interestedJobIds.includes(_id.valueOf()),
            }),
            companyType: companyInfo?.companyType,
            list: [
              `Starting ${moment(new Date(positionInfo?.startDate)).format("Do MMMM YYYY")}`,
              employmentType,
              `${companyInfo?.numOfHorses} ${companyInfo?.numOfHorses > 1 ? "Horses" : "Horse"} ${
                companyInfo?.companyType
              }`,
              positionInfo?.currentlyLocated?.country,
              `${
                positionInfo?.salary
                  ? `${positionInfo?.currency} ${positionInfo?.salary} ${positionInfo?.salaryBasis}`
                  : "Salary: To Be Determined"
              }`,
            ],
          };
        }
      );
};

module.exports = {
  handleJobMapping,
};
