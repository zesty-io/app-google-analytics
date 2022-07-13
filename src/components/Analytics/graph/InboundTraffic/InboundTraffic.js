import React, {useEffect, useState} from 'react' 
import { Doughnut } from "react-chartjs-2";
import GraphContainer from '../../../ui/GraphContainer';
import { useDateRange } from '../../../../context/DateRangeContext';
import { useNotify } from '../../../../context/SnackBarContext';
import { request } from '../../../../utility/request';

export const InboundTraffic = ({ data, setGALegacyStatus, instanceZUID, profileID}) => {

    const notify = useNotify()
    const dateRange = useDateRange()
    const [chartData, setChartData] = useState(data)
    const [loading, setLoading] = useState(false)

    useEffect(async () => {
      if (profileID !== null) {

        try{
          setLoading(true)
          const result = await getInboundTraffic()
  
          if(!result.ok) throw result 
  
          const data = await result.json()
          setChartData(data.chartJSData)
          setLoading(false)

        }catch(err){
          const error = await err.json()
          setLoading(false)
          return notify.current.error(error.error)
        }
       

      }
    }, [profileID, dateRange])

    const getInboundTraffic = () => {
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
                  dimensions: [{ name: "ga:medium" }],
                  dimensionFilterClauses: [
                    {
                      filters: [
                        {
                          dimensionName: "ga:medium",
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
      <GraphContainer title="Inbound Traffic" subTitle={dateRange.selectedItem === "Custom" ? dateRange.startDate + " to " + dateRange.endDate : dateRange.selectedItem} loading={loading}>
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
    );

}
