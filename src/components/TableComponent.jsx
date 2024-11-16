import React from "react";

const TableComponent = ({ logs }) => {
  return (
    <table border="1" style={{ width: "100%", marginTop: "20px" }}>
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Gas Volume</th>
          <th>Valve Percentage</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log, index) => (
          <tr key={index}>
            <td>{log.timestamp}</td>
            <td>{log.gasVolume}</td>
            <td>{log.valvePercent}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;
