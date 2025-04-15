import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useHistory } from "react-router-dom";

function Dashboard() {
  const [selectedComplaintOption, setSelectedComplaintOption] =
    useState("all-complaints");
  const [complaints, setComplaints] = useState([]);
  const [topThreeComplaintTypes, setTopThreeComplaintTypes] = useState([]);
  const [openCaseCount, setOpenCaseCount] = useState(0);
  const [closedCaseCount, setClosedCaseCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const history = useHistory();
  const { token } = useAuth();
  useEffect(() => {
    if (!token) {
      history.push("/login");
      return;
    }
    getAllComplaints();
    // below calls are for retrieving close/open case counts
    getOpenOrClosedComplaints("openCases", null);
    getOpenOrClosedComplaints("closedCases", null);
  }, []);

  const getAllComplaints = async () => {
    try {
      const complaintsResponse = fetch(
        "http://127.0.0.1:8000/api/complaints/allComplaints/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      const topThreeComplaintTypesResponse = fetch(
        "http://127.0.0.1:8000/api/complaints/topComplaints/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      const [complaintsResponseData, topThreeComplaintTypesResponseData] =
        await Promise.all([complaintsResponse, topThreeComplaintTypesResponse]);

      if (!complaintsResponseData.ok) {
        throw new Error(complaintsResponseData.statusText);
      }
      if (!topThreeComplaintTypesResponseData.ok) {
        throw new Error(topThreeComplaintTypesResponseData.statusText);
      }

      const complaints = await complaintsResponseData.json();
      const topComplaintTypes = await topThreeComplaintTypesResponseData.json();
      setComplaints(complaints);
      setTopThreeComplaintTypes(topComplaintTypes);
    } catch (error) {
      setError(error.message);
    }
  };

  const getComplaintsBySameDist = async () => {
    setSelectedComplaintOption("");
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/complaints/complaintsBySameDist/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const complaints = await response.json();
      setComplaints(complaints);
      setError(null);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const getOpenOrClosedComplaints = async (caseType, selectedComplaint) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/complaints/${caseType}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const complaints = await response.json();
      // If user is looking for open or closed cases, only then modify the complaints state else request is from page reload for purpose of updating case count state
      if (caseType === "openCases") {
        setOpenCaseCount(complaints.length);
        if (selectedComplaint === "open-cases") {
          setComplaints(complaints);
        }
      } else if (caseType === "closedCases") {
        setClosedCaseCount(complaints.length);
        if (selectedComplaint === "closed-cases") {
          setComplaints(complaints);
        }
      }
      setError(null);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleSelectedComplaintOption = (e) => {
    const selectedComplaint = e.target.value;
    setSelectedComplaintOption(selectedComplaint);
    if (selectedComplaint === "all-complaints") {
      getAllComplaints();
    } else if (selectedComplaint === "open-cases") {
      getOpenOrClosedComplaints("openCases", selectedComplaint);
    } else if (selectedComplaint === "closed-cases") {
      getOpenOrClosedComplaints("closedCases", selectedComplaint);
    }
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">
        My District Complaints &#62;{" "}
        <select
          onChange={handleSelectedComplaintOption}
          value={selectedComplaintOption}
        >
          <option value="">Select a complaint option</option>
          <option value="all-complaints">All complaints</option>
          <option value="open-cases">Open cases</option>
          <option value="closed-cases">Closed cases</option>
        </select>
      </h2>
      <div className="dashboard-subcontent-layout-container">
        <div className="table-container">
          {!loading ? (
            <table className="main-complaints-table">
              <thead>
                <tr>
                  <th>Account</th>
                  <th>Borough</th>
                  <th>City</th>
                  {selectedComplaintOption !== "open-cases" ? (
                    <th>Close Date</th>
                  ) : null}
                  <th>Community Board</th>
                  <th>Complaint Type</th>
                  <th>Council Dist</th>
                  <th>Descriptor</th>
                  <th>Open Date</th>
                  <th>Zip Code</th>
                </tr>
              </thead>
              <tbody>
                {complaints.length > 0 ? (
                  complaints.map((complaint, idx) => (
                    <tr key={idx}>
                      <td>{complaint.account}</td>
                      <td>{complaint.borough}</td>
                      <td>{complaint.city}</td>
                      {selectedComplaintOption !== "open-cases" ? (
                        <td className="no-wrap">{complaint.closedate}</td>
                      ) : null}
                      <td>{complaint.community_board}</td>
                      <td>{complaint.complaint_type}</td>
                      <td>{complaint.council_dist}</td>
                      <td>{complaint.descriptor}</td>
                      <td className="no-wrap">{complaint.opendate}</td>
                      <td>{complaint.zip}</td>
                    </tr>
                  ))
                ) : (
                  <div className="no-complaints-found-div">
                    No complaints found
                  </div>
                )}
              </tbody>
            </table>
          ) : (
            <div className="loading-screen">
              <p>Loading...</p>
            </div>
          )}
        </div>

        <div className="extra-dashboard-content-container">
          <div className="top-complaint-container">
            <h3>Top 3 Complaint Types</h3>
            <ol>
              {topThreeComplaintTypes ? (
                topThreeComplaintTypes.map((complaintType, idx) => (
                  <li key={idx}>
                    <strong>{complaintType.complaint_type}</strong>
                  </li>
                ))
              ) : (
                <li>No complaint type to display</li>
              )}
            </ol>
          </div>
          <div className="case-count">
            <h4>Number of open cases</h4> <p>{openCaseCount}</p>
          </div>
          <div className="case-count">
            <h4>Number of closed cases</h4> <p>{closedCaseCount}</p>
          </div>
          <button
            className="my-constituents-complaints-btn"
            onClick={getComplaintsBySameDist}
          >
            Complaints by My Constituents
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
