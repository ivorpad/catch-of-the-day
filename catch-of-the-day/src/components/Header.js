// Stateless functional component.
// We just create a new const (var) with arrow function (as a best practice)
// This is stateless because it won't change state (pretty obvious)

import React from 'react';

const Header = (props) => {
    return (
      <header className="top">
        <h1>Catch of the day</h1>
        <h3 className="tagline"><span>{props.tagline}</span></h3>
      </header>
    )
}

Header.propTypes = {
  tagline: React.PropTypes.string
};

export default Header;
