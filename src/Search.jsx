import React, { Component } from 'react';
import styled from 'styled-components';



class Search extends Component {

    render(){
    return(
      <div className={"input-group input-group-" + this.props.size}>
        <input type="text" className="form-control"
        placeholder={this.props.placeholder}
        ref={input => this.search = input}
        onChange={this.handleChange}/>
      </div>

    );
    }
}

export default Search;
