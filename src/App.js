import React, { Component } from 'react';
import './App.scss';

class Student extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentList: [],
      searchName: ''
    };
  }

  componentDidMount() {
    fetch('https://api.hatchways.io/assessment/students')
      .then(res => res.json())
      .then(res => {
        this.setState({ studentList: res.students });
      })
  }

  onChangeSearchName = (event) => {
    this.setState({ searchName: event.target.value });
  }

  getStudentAverage = (student) => {
    let sum = 0;
    student.grades.forEach(value => sum += Number(value));
    return sum / student.grades.length;
  }

  getStudentList = () => {
    const { studentList, searchName } = this.state;
    if (!searchName) return studentList;
    return studentList.filter(item => item.firstName.includes(searchName) || item.lastName.includes(searchName));
  }

  render() {
    const { searchName } = this.state;

    return (
      <div className="student-content">
        <div className="search-input-content">
          <input placeholder="Search by name" value={searchName} onChange={this.onChangeSearchName} />
        </div>
        <div className="student-list">
          {
            this.getStudentList().map(student =>
              <div className="student" key={student.id}>
                <img src={student.pic} className="avatar" alt={student.id} />
                <div className="content">
                  <div className="name">{`${student.firstName} ${student.lastName}`}</div>
                  <div className="email">Email: {student.email}</div>
                  <div className="company">Company: {student.company}</div>
                  <div className="skill">Skill: {student.skill}</div>
                  <div className="average">Average: {this.getStudentAverage(student)}%</div>
                </div>
              </div>
            )}
        </div>
      </div>
    );
  }
}

export default Student;