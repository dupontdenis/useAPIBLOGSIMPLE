// UI helpers and DOM references
const UI = {
  els: {
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
  },

  setBusy(el, busy) {
    const buttons = el.querySelectorAll
      ? el.querySelectorAll("button, input, textarea")
      : [el];
    buttons.forEach((b) => (b.disabled = !!busy));
  },

  setStatus(el, text) {
    if (!el) return;
    el.textContent = text;
  },

  pretty(obj) {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  },

  escapeHtml(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  },

  escapeAttr(s) {
    return String(s ?? "").replace(/["']/g, "");
  },
};
