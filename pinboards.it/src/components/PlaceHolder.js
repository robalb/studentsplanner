import React from 'react';
import ReactPlaceholder from 'react-placeholder';
import "react-placeholder/lib/reactPlaceholder.css";
import {TextRow} from 'react-placeholder/lib/placeholders';

const customTextRow = (
    <TextRow color='#E0E0E0' style={{margin: 0}}/>
);

const PlaceHolder = (props) => (
  <ReactPlaceholder type={"textRow"}
  customPlaceholder={customTextRow}
  firstLaunchOnly={true}
  showLoadingAnimation={true}
  {...props}
  />);

export default PlaceHolder;

