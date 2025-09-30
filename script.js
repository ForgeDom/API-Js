class DataManager {
  constructor(apiUrl, retries = 3, delay = 1000) {
    this.apiUrl = apiUrl;
    this.cache = null;
    this.retries = retries; 
    this.delay = delay;     
  }

  _wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async fetchData() {
    if (this.cache) return this.cache;

    for (let i = 0; i < this.retries; i++) {
      try {
        const response = await fetch(this.apiUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        this.cache = data;
        return data;
      } catch (err) {
        console.warn(`Спроба ${i + 1} не вдалася: ${err.message}`);
        if (i < this.retries - 1) await this._wait(this.delay);
      }
    }

    console.error("Не вдалося завантажити дані після кількох спроб");
    return [];
  }

  async filterData(predicate) {
    const data = await this.fetchData();
    return data.filter(predicate);
  }

  async sortData(compareFn) {
    const data = await this.fetchData();
    return [...data].sort(compareFn);
  }

  clearCache() {
    this.cache = null;
  }
}

 const manager = new DataManager("https://jsonplaceholder.typicode.com/posts");
    const postsDiv = document.getElementById("posts");

    async function showPosts() {
      const posts = await manager.fetchData();
      postsDiv.innerHTML = posts.slice(0, 5) 
        .map(post => `<p><strong>${post.title}</strong><br>${post.body}</p>`)
        .join("");
    }

    showPosts();