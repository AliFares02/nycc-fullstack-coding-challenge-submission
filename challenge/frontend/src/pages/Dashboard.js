import React, { useEffect, useState } from "react";

function Dashboard() {
  const [selectedComplaintOption, setSelectedComplaintOption] =
    useState("all-complaints");
  const [complaints, setComplaints] = useState([]);
  const [topThreeComplaintTypes, setTopThreeComplaintTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    getAllComplaints();
  }, []);

  const getAllComplaints = async () => {
    try {
      const complaintsResponse = fetch(
        "http://127.0.0.1:8000/api/complaints/allComplaints/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token ",
          },
        }
      );
      const topThreeComplaintTypesResponse = fetch(
        "http://127.0.0.1:8000/api/complaints/topComplaints/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token ",
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

  // abstract the 3 functions below into a single function and cache the responses to avoid redundant db requests

  const getComplaintsBySameDist = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/complaints/complaintsBySameDist/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token ",
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

  const getOpenComplaints = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/complaints/openCases/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token ",
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

  const getClosedComplaints = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/complaints/closedCases/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token ",
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

  const handleSelectedComplaintOption = (e) => {
    const selectedComplaint = e.target.value;
    setSelectedComplaintOption(selectedComplaint);
    if (selectedComplaint == "all-complaints") {
      getAllComplaints();
    } else if (selectedComplaint == "open-cases") {
      getOpenComplaints();
    } else if (selectedComplaint == "closed-cases") {
      getClosedComplaints();
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
      <div className="table-container">
        {!loading ? (
          <table className="main-complaints-table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Borough</th>
                <th>City</th>
                <th>Close Date</th>
                <th>Community Board</th>
                <th>Complaint Type</th>
                <th>Council Dist</th>
                <th>Descriptor</th>
                <th>Open Date</th>
                <th>Zip Code</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint, idx) => (
                <tr key={idx}>
                  <td>{complaint.account}</td>
                  <td>{complaint.borough}</td>
                  <td>{complaint.city}</td>
                  <td>{complaint.closedate}</td>
                  <td>{complaint.community_board}</td>
                  <td>{complaint.complaint_type}</td>
                  <td>{complaint.council_dist}</td>
                  <td>{complaint.descriptor}</td>
                  <td>{complaint.opendate}</td>
                  <td>{complaint.zip}</td>
                </tr>
              ))}
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
        <button
          className="my-constituents-complaints-btn"
          onClick={getComplaintsBySameDist}
        >
          Complaints by My Constituents
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
