import { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { Card, CardHeader, CardContent } from "@zesty-io/core/Card";
import { AppLink } from "@zesty-io/core/AppLink";
import { WithLoader } from "@zesty-io/core/WithLoader";
import GraphContainer from "../GraphContainer";

export const RecentlyEdited = ({items, loading}) => {

  return (
    <GraphContainer title="Recent Instance Edits">
      <WithLoader
          condition={!loading}
          message="Loading Recent Items"
        >
          {items.length ? (
            <ul>
              {this.props.items.map((item, i) => (
                <li key={i}>
                  <AppLink
                    to={`/content/${item.meta.contentModelZUID}/${item.meta.ZUID}`}
                  >
                    {item.web.metaTitle ||
                      `Item without a Meta Title: ${item.meta.ZUID}`}
                  </AppLink>
                </li>
              ))}
            </ul>
          ) : (
            "No recently edited items"
          )}
        </WithLoader>
    </GraphContainer>
    
  )

}
