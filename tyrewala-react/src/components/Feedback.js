import React, { Component } from "react";
import axios from "axios";
import {
  FaUser,
  FaAddressCard,
  FaPhone,
  FaEnvelope,
  FaBirthdayCake,
} from "react-icons/fa";
class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedbackList: [],
      userEmail: "",
    };
  }

  componentDidMount() {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      this.setState({ userEmail });
    }
    this.fetchFeedback();
  }

  fetchFeedback = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL +
          "feedback/getAllFeedback" +
          this.state.userEmail
      );
      this.setState({ feedbackList: response.data });
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  render() {
    const { feedbackList } = this.state;

    return (
      <div>
        <h1>Feedback List</h1>
        <FaEnvelope />
        <label> {this.state.userEmail} </label>

        <ul>
          {feedbackList.map((feedback) => (
            <li key={feedback.id}>{feedback.feedback}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Feedback;
