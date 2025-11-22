export default class Attendance {
  constructor({ id, name, role, percentage, records = [] }) {
    this.id = id;
    this.name = name;
    this.role = role; // "student" or "teacher"
    this.percentage = percentage; // overall % (students only)
    this.records = records; // array of { date, status } for calendar
  }

  static fromJSON(json) {
    return new Attendance({
      id: json.id,
      name: json.name,
      role: json.role,
      percentage: json.percentage,
      records: json.records || [],
    });
  }
}
