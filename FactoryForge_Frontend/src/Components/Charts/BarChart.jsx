// components/BarChart.js
import { Bar } from "react-chartjs-2";


const BarChart = ({ chartdata }) => {
  return (
    <div className="chart-container">
      {/*<h2 style={{ textAlign: "center" }}>Bar Chart</h2>*/}
      <Bar
        data={chartdata}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Quantity Available"
            },
            legend: {
              display: false
            }
          }
        }}
      />
    </div>
  );
};

export default BarChart;