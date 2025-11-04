"use strict";

(function () {
  const els = {
    baseUrl: document.getElementById("baseUrl"),
    saveBaseUrl: document.getElementById("saveBaseUrl"),
    baseUrlStatus: document.getElementById("baseUrlStatus"),

    refreshPosts: document.getElementById("refreshPosts"),
    postsList: document.getElementById("postsList"),
    postsCount: document.getElementById("postsCount"),

    getByIdForm: document.getElementById("getByIdForm"),
    getByIdInput: document.getElementById("getByIdInput"),
    getByIdResult: document.getElementById("getByIdResult"),

    createForm: document.getElementById("createForm"),
    createTitle: document.getElementById("createTitle"),
    createStatus: document.getElementById("createStatus"),

    editForm: document.getElementById("editForm"),
    editId: document.getElementById("editId"),
    editTitle: document.getElementById("editTitle"),
    putUpdate: document.getElementById("putUpdate"),
    patchUpdate: document.getElementById("patchUpdate"),
    editStatus: document.getElementById("editStatus"),

    deleteForm: document.getElementById("deleteForm"),
    deleteId: document.getElementById("deleteId"),
    deleteStatus: document.getElementById("deleteStatus"),
  };

  // Base URL management
  let baseUrl =
    localStorage.getItem("posts_api_base_url") || window.location.origin;
  els.baseUrl.value = baseUrl;

  els.saveBaseUrl.addEventListener("click", () => {
    baseUrl = (els.baseUrl.value || "").trim();
    localStorage.setItem("posts_api_base_url", baseUrl);
    els.baseUrlStatus.textContent = "Saved.";
    setTimeout(() => (els.baseUrlStatus.textContent = ""), 1200);
  });

  // Modern fetch helper
  async function fetchAPI(endpoint, options = {}) {
    const url = `${baseUrl.replace(/\/$/, "")}${endpoint}`;
    const config = {
      headers: { "Content-Type": "application/json" },
      ...options,
    };

    const response = await fetch(url, config);
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new Error(
        data?.message || data?.error || `Request failed: ${response.status}`
      );
    }

    return data;
  }

  // All posts
  els.refreshPosts.addEventListener("click", loadPosts);
  loadPosts();

  async function loadPosts() {
    setBusy(els.refreshPosts, true);
    setStatus(els.postsCount, "Loading...");
    try {
      const posts = await fetchAPI("");
      renderPosts(posts || []);
      setStatus(
        els.postsCount,
        `${Array.isArray(posts) ? posts.length : 0} posts`
      );
    } catch (e) {
      renderPosts([]);
      setStatus(els.postsCount, `Error: ${e.message}`);
    } finally {
      setBusy(els.refreshPosts, false);
    }
  }

  function renderPosts(list) {
    if (!Array.isArray(list) || list.length === 0) {
      els.postsList.innerHTML =
        '<div class="muted" style="padding:0.75rem">No posts.</div>';
      return;
    }

    const rows = list
      .map((p) => {
        const postId = p.id || p._id || p.ID || "";
        return `
      <tr>
        <td><span class="badge">${escapeHtml(postId)}</span></td>
        <td>${escapeHtml(p.title || "")}</td>
        <td class="actions">
          <button data-action="view" data-id="${escapeAttr(
            postId
          )}" class="secondary">View</button>
          <button data-action="fill" data-id="${escapeAttr(
            postId
          )}">Fill form</button>
          <button data-action="delete" data-id="${escapeAttr(
            postId
          )}" class="danger">Delete</button>
        </td>
      </tr>
    `;
      })
      .join("");

    els.postsList.innerHTML = `
      <table>
        <thead>
          <tr>
            <th style="width:72px">ID</th>
            <th style="width:30%">Title</th>
            <th style="width:240px">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  }

  els.postsList.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const id = btn.getAttribute("data-id");
    const action = btn.getAttribute("data-action");

    if (action === "view") {
      await fetchById(id);
    } else if (action === "fill") {
      await fillEditForm(id);
    } else if (action === "delete") {
      await deleteById(id);
    }
  });

  // Get by ID
  els.getByIdForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = els.getByIdInput.value;
    await fetchById(id);
  });

  async function fetchById(id) {
    if (!id) return;
    setStatus(els.getByIdResult, "Loading...");
    try {
      const post = await fetchAPI(`/${id}`);
      els.getByIdResult.textContent = pretty(post);
    } catch (e) {
      els.getByIdResult.textContent = `Error: ${e.message}`;
    }
  }

  async function fillEditForm(id) {
    try {
      setStatus(els.editStatus, "Loading post...");
      const post = await fetchAPI(`/${id}`);
      els.editId.value = post.id || post._id || post.ID || id;
      els.editTitle.value = post.title || "";
      setStatus(els.editStatus, "Loaded. You can edit title and PUT/PATCH.");
    } catch (e) {
      setStatus(els.editStatus, `Error: ${e.message}`);
    }
  }

  async function deleteById(id) {
    if (!id) return;
    if (!confirm(`Delete post ${id}?`)) return;
    try {
      await fetchAPI(`/${id}`, { method: "DELETE" });
      await loadPosts();
    } catch (e) {
      alert(`Delete failed: ${e.message}`);
    }
  }

  // Create
  els.createForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = els.createTitle.value.trim();
    if (!title) return;

    setBusy(els.createForm, true);
    setStatus(els.createStatus, "Creating...");
    try {
      const created = await fetchAPI("", {
        method: "POST",
        body: JSON.stringify({ title }),
      });
      setStatus(els.createStatus, `Created with ID ${created?.id || ""}`);
      els.createForm.reset();
      await loadPosts();
    } catch (e) {
      setStatus(els.createStatus, `Error: ${e.message}`);
    } finally {
      setBusy(els.createForm, false);
    }
  });

  // Update PUT
  els.putUpdate.addEventListener("click", async () => {
    const id = els.editId.value;
    const title = els.editTitle.value.trim();
    if (!id) return setStatus(els.editStatus, "Enter an ID.");
    if (!title) return setStatus(els.editStatus, "PUT requires title.");

    setBusy(els.editForm, true);
    setStatus(els.editStatus, "Updating (PUT)...");
    try {
      await fetchAPI(`/${id}`, {
        method: "PUT",
        body: JSON.stringify({ title }),
      });
      setStatus(els.editStatus, "Updated.");
      await loadPosts();
    } catch (e) {
      setStatus(els.editStatus, `Error: ${e.message}`);
    } finally {
      setBusy(els.editForm, false);
    }
  });

  // Update PATCH
  els.patchUpdate.addEventListener("click", async () => {
    const id = els.editId.value;
    const title = els.editTitle.value.trim();
    if (!id) return setStatus(els.editStatus, "Enter an ID.");

    const payload = {};
    if (title) payload.title = title;
    if (Object.keys(payload).length === 0)
      return setStatus(els.editStatus, "Nothing to PATCH.");

    setBusy(els.editForm, true);
    setStatus(els.editStatus, "Updating (PATCH)...");
    try {
      await fetchAPI(`/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setStatus(els.editStatus, "Patched.");
      await loadPosts();
    } catch (e) {
      setStatus(els.editStatus, `Error: ${e.message}`);
    } finally {
      setBusy(els.editForm, false);
    }
  });

  // Delete
  els.deleteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = els.deleteId.value;
    if (!id) return;
    if (!confirm(`Delete post ${id}?`)) return;

    setBusy(els.deleteForm, true);
    setStatus(els.deleteStatus, "Deleting...");
    try {
      await fetchAPI(`/${id}`, { method: "DELETE" });
      setStatus(els.deleteStatus, "Deleted.");
      els.deleteForm.reset();
      await loadPosts();
    } catch (e) {
      setStatus(els.deleteStatus, `Error: ${e.message}`);
    } finally {
      setBusy(els.deleteForm, false);
    }
  });

  // Helpers
  function setBusy(el, busy) {
    const buttons = el.querySelectorAll
      ? el.querySelectorAll("button, input, textarea")
      : [el];
    buttons.forEach((b) => (b.disabled = !!busy));
  }

  function setStatus(el, text) {
    if (!el) return;
    if (el.tagName === "PRE") el.textContent = text;
    else el.textContent = text;
  }

  function pretty(obj) {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  }

  function escapeHtml(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttr(s) {
    return String(s ?? "").replace(/["']/g, "");
  }
})();
