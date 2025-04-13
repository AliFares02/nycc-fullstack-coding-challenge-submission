import React from "react";

function Dashboard() {
  return (
    <div className="dashboard">
      <h2 className="dashboard-title">My District Complaints</h2>
      <table className="main-complaints-table">
        <thead>
          <tr>
            <th>Column 1</th>
            <th>Column 2</th>
            <th>Column 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Row 1</td>
            <td>Row 1</td>
            <td>Row 1</td>
          </tr>
          <tr>
            <td>Row 2</td>
            <td>Row 2</td>
            <td>Row 2</td>
          </tr>
          <tr>
            <td>Row 3</td>
            <td>Row 3</td>
            <td>Row 3</td>
          </tr>
          <tr>
            <td>Row 4</td>
            <td>Row 4</td>
            <td>Row 4</td>
          </tr>
          <tr>
            <td>Row 5</td>
            <td>Row 5</td>
            <td>Row 5</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
