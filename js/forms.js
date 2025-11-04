// Form handlers
const Forms = {
  async handleCreate(e) {
    e.preventDefault();
    const title = UI.els.createTitle.value.trim();
    if (!title) return;

    UI.setBusy(UI.els.createForm, true);
    UI.setStatus(UI.els.createStatus, "Creating...");
    try {
      const created = await API.fetchAPI("", {
        method: "POST",
        body: JSON.stringify({ title }),
      });
      UI.setStatus(UI.els.createStatus, `Created with ID ${created?.id || ""}`);
      UI.els.createForm.reset();
      await Posts.loadPosts();
    } catch (e) {
      UI.setStatus(UI.els.createStatus, `Error: ${e.message}`);
    } finally {
      UI.setBusy(UI.els.createForm, false);
    }
  },

  async handlePut() {
    const id = UI.els.editId.value;
    const title = UI.els.editTitle.value.trim();
    if (!id) return UI.setStatus(UI.els.editStatus, "Enter an ID.");
    if (!title) return UI.setStatus(UI.els.editStatus, "PUT requires title.");

    UI.setBusy(UI.els.editForm, true);
    UI.setStatus(UI.els.editStatus, "Updating (PUT)...");
    try {
      await API.fetchAPI(`/${id}`, {
        method: "PUT",
        body: JSON.stringify({ title }),
      });
      UI.setStatus(UI.els.editStatus, "Updated.");
      await Posts.loadPosts();
    } catch (e) {
      UI.setStatus(UI.els.editStatus, `Error: ${e.message}`);
    } finally {
      UI.setBusy(UI.els.editForm, false);
    }
  },

  async handlePatch() {
    const id = UI.els.editId.value;
    const title = UI.els.editTitle.value.trim();
    if (!id) return UI.setStatus(UI.els.editStatus, "Enter an ID.");

    const payload = {};
    if (title) payload.title = title;
    if (Object.keys(payload).length === 0)
      return UI.setStatus(UI.els.editStatus, "Nothing to PATCH.");

    UI.setBusy(UI.els.editForm, true);
    UI.setStatus(UI.els.editStatus, "Updating (PATCH)...");
    try {
      await API.fetchAPI(`/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      UI.setStatus(UI.els.editStatus, "Patched.");
      await Posts.loadPosts();
    } catch (e) {
      UI.setStatus(UI.els.editStatus, `Error: ${e.message}`);
    } finally {
      UI.setBusy(UI.els.editForm, false);
    }
  },

  async handleDelete(e) {
    e.preventDefault();
    const id = UI.els.deleteId.value;
    if (!id) return;
    if (!confirm(`Delete post ${id}?`)) return;

    UI.setBusy(UI.els.deleteForm, true);
    UI.setStatus(UI.els.deleteStatus, "Deleting...");
    try {
      await API.fetchAPI(`/${id}`, { method: "DELETE" });
      UI.setStatus(UI.els.deleteStatus, "Deleted.");
      UI.els.deleteForm.reset();
      await Posts.loadPosts();
    } catch (e) {
      UI.setStatus(UI.els.deleteStatus, `Error: ${e.message}`);
    } finally {
      UI.setBusy(UI.els.deleteForm, false);
    }
  },
};
