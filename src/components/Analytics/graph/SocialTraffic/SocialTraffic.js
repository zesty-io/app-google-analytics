import React, { useState, useEffect } from 'react'
import { Doughnut } from "react-chartjs-2";
import GraphContainer from '../../../ui/GraphContainer';
import { useDateRange } from '../../../../context/DateRangeContext';

export const SocialTraffic = ({ setGALegacyStatus, instanceZUID, profileID, data }) => {

  const dateRange = useDateRange()
  const [chartData, setChartData] = useState(data)
  const [loading, setLoading] = useState(false)

  useEffect(async () => {

    if(profileID !== null){
      setLoading(true)
      const result = await getSocialTraffic()
      if(!result.ok) return setGALegacyStatus(true)
      const data = await result.json()
      setChartData(data.chartJSData)
      setLoading(false)
    }

  }, [profileID, dateRange])

  const getSocialTraffic = () => {
    return fetch(
      `${process.env.REACT_APP_SERVICE_GOOGLE_ANALYTICS_READ}/?zuid=${instanceZUID}`,
      {
        method: "POST",
        credentials: "omit",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify({
          gaRequest: {
            reportRequests: [
              {
                viewId: profileID,
                dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
                metrics: [{ expression: "ga:sessions" }],
                dimensions: [{ name: "ga:socialNetwork" }],
                dimensionFilterClauses: [
                  {
                    filters: [
                      {
                        dimensionName: "ga:socialNetwork",
                        not: true,
                        expressions: ["(not set)"],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          type: "pie",
        }),
      }
    );
  }

  return (
    <GraphContainer title="Social Traffic" subTitle={dateRange.selectedItem === "Custom" ? dateRange.startDate + " to " + dateRange.endDate : dateRange.selectedItem} loading={loading}>
        <Doughnut
          data={chartData}
          // width={250}
          height={220}
          options={{
            maintainAspectRatio: false,
            legend: {
              display: true,
              position: "left",
            },
          }}
        />
    </GraphContainer>
  )

}