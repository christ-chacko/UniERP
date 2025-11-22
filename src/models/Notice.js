export default class Notice {
  constructor({ id, title, content, image_url, author, likes = 0, dislikes = 0, created_at }) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.image_url = image_url;
    this.author = author;
    this.likes = likes;
    this.dislikes = dislikes;
    this.created_at = created_at;
  }

  static fromJSON(json) {
    return new Notice({
      id: json.id,
      title: json.title,
      content: json.content,
      image_url: json.image_url,
      author: json.author,
      likes: json.likes,
      dislikes: json.dislikes,
      created_at: json.created_at,
    });
  }
}
