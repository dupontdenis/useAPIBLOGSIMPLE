// Posts operations
const Posts = {
  async loadPosts() {
    UI.setBusy(UI.els.refreshPosts, true);
    UI.setStatus(UI.els.postsCount, "Loading...");
    try {
      const posts = await API.fetchAPI("");
      this.renderPosts(posts || []);
      UI.setStatus(
        UI.els.postsCount,
        `${Array.isArray(posts) ? posts.length : 0} posts`
      );
    } catch (e) {
      this.renderPosts([]);
      UI.setStatus(UI.els.postsCount, `Error: ${e.message}`);
    } finally {
      UI.setBusy(UI.els.refreshPosts, false);
    }
  },

  renderPosts(list) {
    if (!Array.isArray(list) || list.length === 0) {
      UI.els.postsList.innerHTML =
        '<div class="muted" style="padding:0.75rem">No posts.</div>';
      return;
    }

    const rows = list
      .map((p) => {
        const postId = p.id || p._id || p.ID || "";
        return `
      <tr>
        <td><span class="badge">${UI.escapeHtml(postId)}</span></td>
        <td>${UI.escapeHtml(p.title || "")}</td>
        <td class="actions">
          <button data-action="view" data-id="${UI.escapeAttr(
            postId
          )}" class="secondary">View</button>
          <button data-action="fill" data-id="${UI.escapeAttr(
            postId
          )}">Fill form</button>
          <button data-action="delete" data-id="${UI.escapeAttr(
            postId
          )}" class="danger">Delete</button>
        </td>
      </tr>
    `;
      })
      .join("");

    UI.els.postsList.innerHTML = `
      <table>
        <thead>
          <tr>
            <th style="width:72px">ID</th>
            <th style="width:50%">Title</th>
            <th style="width:240px">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  },

  async fetchById(id) {
    if (!id) return;
    UI.setStatus(UI.els.getByIdResult, "Loading...");
    try {
      const post = await API.fetchAPI(`/${id}`);
      UI.els.getByIdResult.textContent = UI.pretty(post);
    } catch (e) {
      UI.els.getByIdResult.textContent = `Error: ${e.message}`;
    }
  },

  async fillEditForm(id) {
    try {
      UI.setStatus(UI.els.editStatus, "Loading post...");
      const post = await API.fetchAPI(`/${id}`);
      UI.els.editId.value = post.id || post._id || post.ID || id;
      UI.els.editTitle.value = post.title || "";
      UI.setStatus(
        UI.els.editStatus,
        "Loaded. You can edit title and PUT/PATCH."
      );
    } catch (e) {
      UI.setStatus(UI.els.editStatus, `Error: ${e.message}`);
    }
  },

  async deleteById(id) {
    if (!id) return;
    if (!confirm(`Delete post ${id}?`)) return;
    try {
      await API.fetchAPI(`/${id}`, { method: "DELETE" });
      await this.loadPosts();
    } catch (e) {
      alert(`Delete failed: ${e.message}`);
    }
  },
};
