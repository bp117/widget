import React from 'react';
import ReactDOM from 'react-dom';
import SearchWidget from './SearchWidget';

window.SearchWidget = (elementId, config) => {
  ReactDOM.render(<SearchWidget {...config} />, document.getElementById(elementId));
};
