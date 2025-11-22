export default class Comment {
  constructor({ id, notice_id, content, author, created_at }) {
    this.id = id;
    this.notice_id = notice_id;
    this.content = content;
    this.author = author;
    this.created_at = created_at;
  }

  static fromJSON(json) {
    return new Comment({
      id: json.id,
      notice_id: json.notice_id,
      content: json.content,
      author: json.author,
      created_at: json.created_at,
    });
  }
}
