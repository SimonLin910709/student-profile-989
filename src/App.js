import React, { Component } from 'react';
import './App.scss';

class Student extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentList: []
    };
  }

  componentDidMount() {
    fetch('https://api.hatchways.io/assessment/students')
      .then(res => res.json())
      .then(res => {
        console.log(res);
        this.setState({ studentList: res.students });
      })
  }

  getStudentAverage = (student) => {
    let sum = 0;
    student.grades.forEach(value => sum += Number(value));
    return sum / student.grades.length;
  }

  render() {
    const { studentList } = this.state;

    return (
      <div className="student-list">
        {
          studentList.map(student =>
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
    );
  }
}

export default Student;