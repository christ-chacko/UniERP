export default class Subject {
  constructor({ id, name, code, course, branch, semester }) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.course = course;
    this.branch = branch;
    this.semester = semester;
  }

  static fromJSON(json) {
    return new Subject(json);
  }
}
