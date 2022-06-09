import React from "react"
import "./AddRow.style.scss"
const DEFAULT_CLASSNAMES = "add_row"
export default class AddRow extends React.Component{
  constructor(props){
    super(props)
    this.state={
      firstName: "",
      lastName: "",
      email: ""
    }
  }
  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  onSubmmit = (e) => {
    const { onCreate } = this.props;
    e.stopPropagation();
    const {firstName, lastName, email} = this.state;
    const formData = {
      firstName,
      lastName,
      email
    }
    //console.log(">>>formData", formData);
    onCreate(formData);
  }
  render(){
    const {firstName, lastName, email} = this.state;
    return(
      <div className={DEFAULT_CLASSNAMES}>
        <div className={`${DEFAULT_CLASSNAMES}-form`}>
          <label htmlFor="first-name">First Name</label>
          <input className="element" name="firstName" value={firstName} onChange={this.handleChange} type="text" placeholder="Enter Text...." />
          <label htmlFor="last-name">Last Name</label>
          <input className="element" name="lastName" value={lastName} onChange={this.handleChange} type="text" placeholder="Enter Text...." />
          <label htmlFor="email">Email</label>
          <input className="element" name="email" value={email} onChange={this.handleChange} type="text" placeholder="Enter Text...." />
        </div>
        <div className= {`${DEFAULT_CLASSNAMES}-footer`}>
          <button onClick={this.onSubmmit} className="create-btn">Create</button>
        </div>
      </div>
    )
  }
}