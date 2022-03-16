import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import $ from 'jquery';
import './App.scss';

class Student extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentList: [],
      searchName: '',
      searchTag: ''
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

  onChangeSearchTag = (event) => {
    this.setState({ searchTag: event.target.value });
  }

  onStudentCollapse = (index) => {
    const { studentList } = this.state;
    studentList[index].collapse = !studentList[index].collapse;
    this.setState({ studentList });
  }

  onAddTag = (event, index) => {
    if (event.key !== 'Enter') return;

    const { studentList } = this.state;
    const tag = $(`#addtag-${studentList[index].id}`).val();
    if (!tag) return;

    const tags = (studentList[index].tags || []);
    tags.push(tag);
    studentList[index].tags = tags;
    this.setState({ studentList });
    $(`#addtag-${studentList[index].id}`).val('');
  }

  getStudentAverage = (student) => {
    let sum = 0;
    student.grades.forEach(value => sum += Number(value));
    return sum / student.grades.length;
  }

  getStudentList = () => {
    const { studentList, searchName, searchTag } = this.state;
    let result = studentList;
    if (searchName) {
      result = result.filter(student => student.firstName.includes(searchName) || student.lastName.includes(searchName));
    }
    if (searchTag) {
      result = result.filter(student => (student.tags || []).filter(tag => tag.includes(searchTag)).length !== 0);
    }

    return result;
  }

  render() {
    const { searchName, searchTag } = this.state;

    return (
      <div className="student-content">
        <div className="search-input-content">
          <input placeholder="Search by name" value={searchName} onChange={this.onChangeSearchName} />
        </div>
        <div className="search-input-content">
          <input placeholder="Search by tag" value={searchTag} onChange={this.onChangeSearchTag} />
        </div>
        <div className="student-list">
          {this.getStudentList().map((student, index) =>
            <div className="student" key={student.id}>
              <img src={student.pic} className="avatar" alt={student.id} />
              <div className="content">
                <div className="name">{`${student.firstName} ${student.lastName}`}</div>
                <div className="email">Email: {student.email}</div>
                <div className="company">Company: {student.company}</div>
                <div className="skill">Skill: {student.skill}</div>
                <div className="average">Average: {this.getStudentAverage(student)}%</div>

                {
                  student.collapse &&
                  <>
                    <div className="space" />
                    {student.grades.map((grade, index1) =>
                      <div className="test" key={`${student.id}-${index1}`}>
                        Test {index1 + 1}:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{grade}%
                      </div>
                    )}
                  </>
                }

                <div className="tag-list">
                  {(student.tags || []).map((tag, index1) =>
                    <div className="tag" key={`tag-${student.id}-${index1}`}>
                      {tag}
                    </div>
                  )}
                </div>
                <input className="input-tag" id={`addtag-${student.id}`} placeholder="Add a tag" onKeyDown={(event) => this.onAddTag(event, index)} />
              </div>

              <button className="btn-collapse" onClick={() => this.onStudentCollapse(index)}>
                <FontAwesomeIcon icon={student.collapse ? faMinus : faPlus} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Student;