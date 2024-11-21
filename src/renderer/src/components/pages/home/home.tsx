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
import { getApi } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import { useAuthHeader } from 'react-auth-kit'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

export interface DashboardResp {
  invitationType: { [key: string]: number }[]
  department: { [key: string]: number }
  employtype: Employtype[]
  log: Log[]
}

export interface Employtype {
  key: number
}

export interface Log {
  name: string
  date: string
}

const Home = () => {
  const authToken = useAuthHeader()
  const { isLoading, error, data } = useQuery({
    queryKey: ['statisticsSDashboard'],
    queryFn: () =>
      getApi<DashboardResp>('/statistics', {
        headers: {
          Authorization: authToken()
        }
      })
  })

  console.log('data', data?.data)

  // Data for Doughnut Chart
  const doughnutDatas = {
    labels: ['جنائية', 'إدارية', 'تجارية', 'مدنية'],
    datasets: [
      {
        data: [25, 30, 20, 25],
        backgroundColor: ['#4C02BE', '#8400AA', '#B63479', '#EF8357'],
        hoverBackgroundColor: ['#4C02BE', '#8400AA', '#B63479', '#EF8357']
      }
    ]
  }

  const invitationType = data?.data?.invitationType
  const labelsDon = invitationType ? invitationType.map((item) => Object.keys(item)[0]) : []
  const chartDataDon = invitationType ? invitationType.map((item) => Object.values(item)[0]) : []

  const doughnutData = {
    labelsDon,
    datasets: [
      {
        data: chartDataDon,
        backgroundColor: ['#4C02BE', '#8400AA', '#B63479', '#EF8357'],
        hoverBackgroundColor: ['#4C02BE', '#8400AA', '#B63479', '#EF8357']
      }
    ]
  }

  const emp = data?.data?.employtype
  const labelsEmp = emp ? emp.map((item) => Object.keys(item)[0]) : []
  const chartDataEmp = emp ? emp.map((item) => Object.values(item)[0]) : []

  const doughnutEmp = {
    labelsEmp,
    datasets: [
      {
        data: chartDataEmp,
        backgroundColor: ['#8400AA', '#B63479', '#4C02BE'],
        hoverBackgroundColor: ['#8400AA', '#B63479', '#4C02BE']
      }
    ]
  }
  const department = data?.data?.department
  const labels = department ? Object.keys(department) : []
  const chartData = department ? Object.values(department) : []

  const barData = {
    labels,
    datasets: [
      {
        label: 'Department Data', // Optional: Give a label to the dataset
        data: chartData,
        backgroundColor: '#4C02BE'
      }
    ]
  }

  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 p-2">
      {/* Doughnut Chart Section */}
      <div className="bg-white rounded-t-2xl border-[2px] border-[#E5E7EB] col-span-1 lg:col-span-2 flex relative flex-col items-center h-80">
        <h3 className="text-start text-[#2F3746] text-lg px-9 mb-1 font-semibold rounded-t-2xl border-t-[2px] border-[#E5E7EB] py-3 w-full absolute -top-[2px] bg-[#3734A9]/[.20]">
          أنواع القضايا
        </h3>
        <div className="w-full h-full flex items-center justify-center mt-10 relative">
          {/* Legend Container */}
          <div className="w-[100%] flex justify-start pr-4 absolute -left-12">
            <ul className="text-right">
              {doughnutDatas.labels.map((label, index) => (
                <li key={index} className="flex items-center pt-4">
                  <span
                    className="w-3 h-3 rounded-full ml-2"
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
      <div className="bg-white rounded-t-2xl border-[2px] relative border-[#E5E7EB] p-2 col-span-4 lg:col-span-3 flex flex-col md:flex-row items-center h-80">
        <h3 className="text-start text-[#2F3746] text-lg px-9 mb-1 font-semibold rounded-t-2xl border-t-[2px] border-[#E5E7EB] py-3 left-0 w-full absolute -top-[2px] bg-[#3734A9]/[.20]">
          الموظفين
        </h3>
        <div className="w-full h-full flex items-center justify-center mt-10 relative">
          {/* Legend Container */}
          <div className="w-[100%] flex justify-start pr-4 absolute top-24 -left-12">
            <ul className="text-right">
              {doughnutEmp.labelsEmp.map((label, index) => (
                <li key={index} className="flex items-center pt-4">
                  <span
                    className="w-3 h-3 rounded-full ml-2"
                    style={{ backgroundColor: doughnutEmp.datasets[0].backgroundColor[index] }}
                  ></span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
          {/* Chart Container */}
          <div className="w-[45%] h-[80%] absolute left-12">
            <Doughnut
              data={{
                ...doughnutEmp,
                datasets: doughnutEmp.datasets.map((dataset) => ({
                  ...dataset,
                  borderRadius: 15, // Add rounded corners to the doughnut segments
                  cutout: '85%' // Adjust the cutout percentage to make the ring look rounded
                }))
              }}
              options={{
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

      {/* Bar Chart Section */}
      <div className="bg-white rounded-t-2xl border-[2px] border-[#E5E7EB] pb-7 col-span-2 lg:col-span-3 h-80 w-full">
        <h3 className="text-start px-5 text-[#2F3746] text-lg mb-1 font-semibold rounded-t-2xl relative -top-[2px] border-t-[2px] border-[#E5E7EB] p-2 bg-[#3734A9]/[.20]">
          إحصائيات الإدارات
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
              maintainAspectRatio: false,
              responsive: true,
              plugins: {
                legend: {
                  display: false // Remove the legend
                }
              },
              scales: {
                x: {
                  grid: {
                    display: false
                  }
                },
                y: {
                  beginAtZero: true,
                  max: 1000 // Set the Y-axis maximum value to 10000
                }
              }
            }}
          />
        </div>
      </div>

      {/* List Section */}
      <div className="bg-white rounded-lg rounded-t-2xl border-[2px] border-[#E5E7EB] col-span-2 lg:col-span-2 h-80 ">
        <h3 className="text-start px-5 text-[#2F3746] text-lg mb-1 font-semibold rounded-t-2xl relative -top-[2px] border-t-[2px] border-[#E5E7EB] p-2 bg-[#3734A9]/[.20]">
          اخر التحديثات
        </h3>
        <div className="space-y-3 mt-4">
          {data?.data?.log && (
            <>
              {data?.data?.log
                .sort((a: Log, b: Log) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Type Log and use .getTime() to ensure it returns a number
                .map((log, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-start p-2 border rounded-lg"
                  >
                    <span className="h-12 bg-[#3734A9]/[.20] flex items-center p-4 rounded-2xl">
                      <BookIcon className="text-base font-black text-[#3734A9] w-6 h-8" />
                    </span>
                    <div className="h-12 mr-4">
                      <p className="font-medium">{log.name}</p>
                      <p className="text-xs text-gray-500">{String(log.date).split('T')[0]}</p>
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
