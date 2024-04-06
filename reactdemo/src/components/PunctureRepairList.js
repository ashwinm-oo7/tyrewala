// PunctureRepairList.js
import React, { Component } from "react";
import axios from "axios";
import "../css/PunctureRepair.css";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaCar,
  FaTools,
  FaInfoCircle,
  FaRupeeSign,
} from "react-icons/fa";

class PunctureRepairList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      punctureRepairs: [],
      statusStr: [],
      loading: true,
      mobileNumber: "",
      isAdmin: false,
      totalAmount: 0,
    };

    const params = new URLSearchParams(window.location.search);
    console.log(params.get("isAdmin"));
    this.state.mobileNumber = params.get("mob");
    this.state.isAdmin = params.get("isAdmin");
  }

  componentDidMount() {
    if (this.state.mobileNumber) {
      this.fetchPunctureRepairsByMobile();
    } else if (this.state.isAdmin) {
      this.fetchPunctureRepairs();
    }
    this.getAllStatusStr();
  }

  getAllStatusStr = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "punctureRepair/getAllStatusStr"
      );
      console.log("Request for Repairing", process.env.REACT_APP_API_URL);
      this.setState({ statusStr: response.data });
    } catch (error) {
      console.error("Error fetching puncture repairs:", error);
      // Handle error
    }
  };

  fetchPunctureRepairsByMobile = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;

      console.log("Fetchingjjgjhdgshdds " + apiUrl);
      const response = await axios.get(
        process.env.REACT_APP_API_URL +
          `punctureRepair/getPunctureRepairByMobileList/${this.state.mobileNumber}`
      );
      console.log("Request for Repairing", response.data);
      this.setState({ punctureRepairs: response.data, loading: false });
    } catch (error) {
      console.error("Error fetching puncture repairs:", error);
      // Handle error
    }
  };

  fetchPunctureRepairs = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "punctureRepair/getPunctureRepairList"
      );
      console.log("Request for Repairing", response.data);
      this.setState({ punctureRepairs: response.data, loading: false });
    } catch (error) {
      console.error("Error fetching puncture repairs:", error);
      // Handle error
    }
  };

  handleRepairStatusChange = async (_id, status) => {
    try {
      // Update the repair status locally
      this.setState((prevState) => ({
        punctureRepairs: prevState.punctureRepairs.map((repair) =>
          repair._id === _id ? { ...repair, status } : repair
        ),
      }));

      console.log(this.state.totalAmount);

      await axios.put(
        process.env.REACT_APP_API_URL +
          `punctureRepair/updateRepairStatus/${_id}/${status}`,
        { status }
      );
    } catch (error) {
      console.error("Error updating repair status:", error);
      // Handle error
    }
  };

  handleTotalAmtChange = async (e, _id, repair, amt) => {
    try {
      // Update the repair status locally
      repair.totalAmount = amt;
      this.setState((prevState) => ({
        punctureRepairs: prevState.punctureRepairs.map((repair) =>
          repair._id === _id ? { ...repair, totalAmount: amt } : repair
        ),
      }));

      // Update the total amount in the state
      // this.setState({ totalAmount });

      await axios.put(
        process.env.REACT_APP_API_URL +
          `punctureRepair/updateAmout/${_id}/${amt}`,
        { amt }
      );
    } catch (error) {
      console.error("Error updating repair status:", error);
      // Handle error
    }
  };

  restrictToNumbers = (event) => {
    const regex = /[0-9]/; // Regular expression to match only numbers
    const inputValue = event.key;

    if (
      event.keyCode === 8 || // backspace
      event.keyCode === 46 || // delete
      event.keyCode === 9 || // tab
      event.keyCode === 27 || // escape
      event.keyCode === 13 // enter
    ) {
      return;
    }

    // Check if the input value matches the regex
    if (!regex.test(inputValue)) {
      event.preventDefault(); // Prevent the default action of the keypress
    }
  };

  render() {
    const { punctureRepairs, loading } = this.state;

    if (loading) {
      return <div>Loading...</div>; // Render loading indicator while fetching data
    }

    return (
      <div className="puncture-repair-list-container">
        <h2>
          <FaTools style={{ marginRight: "5px" }} />
          {this.state.isAdmin
            ? "Admin Puncture Repair List"
            : "Your Puncture Repairs"}
        </h2>
        <div className="puncture-repair-list-header">
          <span className="puncture-repair-list-header-item">
            <FaMapMarkerAlt style={{ marginRight: "5px" }} />
            Location
          </span>
          <span className="puncture-repair-list-header-item">
            <FaPhone style={{ marginRight: "5px" }} />
            Mobile No
          </span>
          <span className="puncture-repair-list-header-item">
            <FaCar style={{ marginRight: "5px" }} />
            Vehicle Number
          </span>
          <span className="puncture-repair-list-header-item">
            <FaRupeeSign style={{ marginRight: "5px" }} />
            Total Amount
          </span>
          <span className="puncture-repair-list-header-item status">
            {" "}
            <FaInfoCircle style={{ marginRight: "5px" }} />
            Status
          </span>
        </div>
        <ul className="puncture-repair-list">
          {punctureRepairs.map((repair) => (
            <li key={repair._id} className="puncture-repair-item">
              <span>{repair.location}</span>
              <span>{repair.mobileNumber}</span>
              <span>{repair.vehiclePlateNo}</span>
              <span>
                {/* <>&#8377;</>   */}
                <input
                  disabled={!this.state.isAdmin}
                  type="number"
                  onKeyPress={this.restrictToNumbers}
                  className="form-control"
                  placeholder="Total Amount"
                  value={repair.totalAmount}
                  onChange={(e) =>
                    this.handleTotalAmtChange(
                      e,
                      repair._id,
                      repair,
                      e.target.value
                    )
                  }
                />
              </span>
              {this.state.isAdmin ? (
                <span>
                  <select
                    value={repair.status}
                    onChange={(e) =>
                      this.handleRepairStatusChange(repair._id, e.target.value)
                    }
                    className={
                      repair.status === "In Progress"
                        ? "red"
                        : repair.status === "On Process"
                        ? "orange"
                        : "green"
                    }
                  >
                    {this.state.statusStr.map((str, index2) => (
                      <option value={str}> &#x25CF; {str}</option>
                    ))}
                  </select>
                </span>
              ) : (
                <span>{repair.status}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default PunctureRepairList;
