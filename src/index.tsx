import React from 'react';
import ReactDOM from 'react-dom';
import FancySearchWidget from './FancySearchWidget';

// Export the widget as a global function
window.FancySearchWidget = (elementId: string, config: any) => {
  ReactDOM.render(
    <FancySearchWidget {...config} />,
    document.getElementById(elementId)
  );
};
