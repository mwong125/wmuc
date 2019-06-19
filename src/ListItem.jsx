{/*AUTHOR: Alina*/}

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import NavItem from './NavItem.jsx'
import DJInfo from './DJInfo.jsx'



class ListItem extends Component{
  constructor(props){
    super(props);
    this.data = this.props.data;
  }

  render(){

    return(

    <div className="media mb-5">
      <img className="mr-3 rounded-circle" src="http://placehold.it/64x64"  alt="DJ Profile image" />
      <div className="media-body">
        <h5 className="mt-0">

          <Link
          to={'/djinfo/' + this.data._user_name}>
          {this.data._user_name}

          </Link>
        </h5>
        {/*{this.data.show_list.join(", ")}*/}
        dummy call to get user shows
      </div>
    </div>
    );
  }
}

export default ListItem;
