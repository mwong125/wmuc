import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import NavItemDropdownLink from './NavItemDropdownLink.jsx';
import Dropdown from './Dropdown.jsx';

const StyledLink = styled(Link)`
  padding-right: 1rem;
  cursor: pointer;

  &, &:hover {
    color: var(--color);
    text-decoration: none;
  }

  &::after {
      display: ${props => props.isDropdown ? 'inline-block' : 'none'};
      margin-left: 0.255rem;
      vertical-align: 0.255rem;
      content: '';
      border-top: 0.3rem solid;
      border-right: 0.3rem solid transparent;
      border-bottom: 0;
      border-left: 0.3rem solid transparent;
  }
`;

class NavItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDropdownVisibie: false
    }
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
  }

  toggleDropdown() {
    this.setState({
      isDropdownVisible: !this.state.isDropdownVisible
    });
  }

  closeDropdown() {
    this.setState({
      dropdownVisibility: false
    });
  }

  render() {
    let navItemDropdown = null;
    let isDropdown = this.props.links.length > 0;
    let onClick = this.toggleDropdown;

    if (isDropdown) {
      let dropdownItems = this.props.links.map(
        (link) =>
        <NavItemDropdownLink
          key={link.href}
          href={link.href}
          label={link.label}
          component={link.component}
        />
      );

      navItemDropdown = (
        <Dropdown align="left" isVisible={this.state.isDropdownVisible}>
          {dropdownItems}
        </Dropdown>
      );
    } else {
      return (
        <li>
          <StyledLink to={this.props.href} isDropdown={isDropdown} role="button">

              {this.props.label}

          </StyledLink>
        </li>
      );
    }
    return (
      <li className="dropdown" onClick={onClick}>
        <StyledLink to="#" isDropdown={isDropdown} role="button" aria-label="dropdown">
          {this.props.label}
        </StyledLink>
        {navItemDropdown}
      </li>
    );
  }
}

export default NavItem;
