import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js'
import BookIcon from '@renderer/components/icons/book-icon'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

const Home = () => {
  // Data for Doughnut Chart
  const doughnutData = {
    labels: ['جنائية', 'إدارية', 'تجارية', 'مدنية'],
    datasets: [
      {
        data: [25, 30, 20, 25],
        backgroundColor: ['#4C02BE', '#8400AA', '#B63479', '#EF8357'],
        hoverBackgroundColor: ['#4C02BE', '#8400AA', '#B63479', '#EF8357']
      }
    ]
  }

  // Data for Bar Chart
  const barData = {
    labels: ['التعويضات', 'قضايا الدولة', 'إدارة الأقضاء', 'القرارات'],
    datasets: [
      {
        label: '2024',
        data: [200, 100, 150, 50],
        backgroundColor: '#4C02BE'
      }
    ]
  }

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: 'مربع يستبدل بنص'
      }
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 p-2">
      {/* Doughnut Chart Section */}
      <div className="bg-white rounded-t-2xl border-[2px] border-[#E5E7EB] col-span-1 lg:col-span-2 flex relative flex-col items-center h-80">
        <h3 className="text-start text-[#2F3746] text-lg px-9 mb-1 font-semibold rounded-t-2xl border-t-[2px] border-[#E5E7EB] py-3 w-full absolute top-0 bg-[#3734A9]/[.20]">
          مربع يستبدل بنص
        </h3>
        <div className="w-full h-full flex items-center justify-center mt-10 relative">
          {/* Legend Container */}
          <div className="w-[100%] flex justify-start pr-4 absolute -left-12">
            <ul className="text-right">
              {doughnutData.labels.map((label, index) => (
                <li key={index} className="flex items-center pt-4">
                  <span
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: doughnutData.datasets[0].backgroundColor[index] }}
                  ></span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
          {/* Chart Container */}
          <div className="w-[45%] h-[80%] absolute left-12">
            <Doughnut
              data={doughnutData}
              options={{
                cutout: '0%',
                plugins: {
                  legend: {
                    display: false // Hide the default legend so we can manually create it on the left
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Radial Progress and Stats Section */}
      <div className="bg-white rounded-t-2xl border-[2px] border-[#E5E7EB] p-2 col-span-4 lg:col-span-3 flex flex-col md:flex-row items-center h-80">
        {/* <div className="w-full md:w-1/2">
          <h3 className="text-base font-semibold mb-1">مربع يستبدل بنص</h3>
          <div className="flex items-center">
            <div className="w-1/3">
              <Doughnut data={doughnutData} options={{ cutout: '70%' }} />
            </div>
            <div className="ml-1">
              <p className="text-2xl font-bold">12,500</p>
              <p className="text-xs text-gray-500">مربع يستبدل بنص المساحة</p>
            </div>
          </div>
        </div> */}
        {/* <div className="w-full md:w-1/2 mt-1 md:mt-0 md:ml-1 space-y-1">
          <div className="flex items-center space-x-1">
            <FiClock className="text-base text-gray-700" />
            <span className="text-sm font-medium">12,500</span>
          </div>
          <div className="flex items-center space-x-1">
            <FiClipboard className="text-base text-gray-700" />
            <span className="text-sm font-medium">12,500</span>
          </div>
          <div className="flex items-center space-x-1">
            <FiUsers className="text-base text-gray-700" />
            <span className="text-sm font-medium">12,500</span>
          </div>
        </div> */}
      </div>

      {/* Bar Chart Section */}
      <div className="bg-white rounded-t-2xl border-[2px] border-[#E5E7EB] pb-7 col-span-2 lg:col-span-3 h-80 w-full">
        <h3 className="text-start px-5 text-[#2F3746] text-lg mb-1 font-semibold rounded-t-2xl border-t-[2px] border-[#E5E7EB] p-2 bg-[#3734A9]/[.20]">
          مربع يستبدل بنص
        </h3>
        <div className="w-full h-[92%] px-5">
          <Bar
            data={{
              ...barData,
              datasets: barData.datasets.map((dataset) => ({
                ...dataset,
                barThickness: 20, // Make the bars thinner
                borderRadius: {
                  topLeft: 10,
                  topRight: 10
                }
              }))
            }}
            options={{
              ...barOptions,
              maintainAspectRatio: false,
              responsive: true,
              plugins: {
                legend: {
                  labels: {
                    usePointStyle: true
                  }
                }
              },
              scales: {
                x: {
                  grid: {
                    display: false
                  }
                },
                y: {
                  beginAtZero: true
                }
              }
            }}
          />
        </div>
      </div>

      {/* List Section */}
      <div className="bg-white rounded-lg rounded-t-2xl border-[2px] border-[#E5E7EB] col-span-2 lg:col-span-2 h-80 ">
        <h3 className="text-start px-5 text-[#2F3746] text-lg mb-1 font-semibold rounded-t-2xl border-t-[2px] border-[#E5E7EB] p-2 bg-[#3734A9]/[.20]">
          مربع يستبدل بنص
        </h3>
        <div className="space-y-3 mt-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-start p-2 border rounded-lg">
              <span className="h-12 bg-[#3734A9]/[.20] flex items-center p-4 rounded-2xl">
                <BookIcon className="text-base font-black text-[#3734A9] w-6 h-8"  />
              </span>
              <div className="h-12 mr-4">
                <p className="font-medium">مربع يستبدل بنص المساحة</p>
                <p className="text-xs text-gray-500">12/03/2024</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
