import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// eslint-disable-next-line react/prop-types
const DoughnutChart = ({percentage}) => {

  const data = {
    labels: ['Pronunciation:'],
    datasets: [
      {
        data: [percentage, 100-percentage],
        backgroundColor: ['#36A22B', '#FFFF11'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  // Custom plugin to draw text in the center
  const centerTextPlugin = {
    id: 'centerText',
    afterDraw: (chart) => {
      const { ctx, width, height } = chart;
      ctx.restore();
      const fontSize = (height / 114).toFixed(2);
      ctx.font = `${fontSize}em sans-serif`;
      ctx.textBaseline = 'middle';

      const text = Number(percentage);
      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = height / 2;

      ctx.fillText(text, textX, textY);
      ctx.save();
    },
  };

  return (
    <div >
		{/* <p></p> */}
      <Doughnut data={data} options={options} />
    </div>
  );
};


export default DoughnutChart