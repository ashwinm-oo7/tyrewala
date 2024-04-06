// Constant.js

const Constant = {
  APPROVED_STR: "Approved",
  REJECTED_STR: "Rejected",
  INPROGRESS_STR: "In Progress",
  SUCCESS_STR: "Success",
  FAILED_TO_REPAIR_STR: "Failed To Repair",
  SUGGESTED_FOR_NEW_TYRE_STR: "Suggested For New Tyre",
  SUGGESTED_FOR_NEW_TUBE_STR: "Suggested For New Tube",

  getAllStatusStr: function () {
    return [
      this.APPROVED_STR,
      this.REJECTED_STR,
      this.INPROGRESS_STR,
      this.SUCCESS_STR,
      this.FAILED_TO_REPAIR_STR,
      this.SUGGESTED_FOR_NEW_TYRE_STR,
      this.SUGGESTED_FOR_NEW_TUBE_STR,
    ];
  },
};

module.exports = Constant;
