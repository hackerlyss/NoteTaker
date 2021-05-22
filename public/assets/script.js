
const saveBtn = document.querySelector(".save-btn");
const newBtn = document.querySelector(".new-btn");
const noteTitle = document.querySelector(".note-title");
const noteText = document.querySelector(".note-textarea");
let noteList = document.querySelectorAll('.list-container .list-group');
  
  const show = (elem) => {
    elem.style.display = 'inline';
  };
  const hide = (elem) => {
    elem.style.display = 'none';
  };

  let activeNote = {};

  const getNote = () => 
  fetch('/api/notes', {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
  });

  const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(note),
  });
  
  const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
  });

  const showActiveNote = () => {
    hide(saveBtn);
    if (activeNote.id) {
      noteTitle.setAttribute('readonly',true);
      noteText.setAttribute('readonly',true);
      noteTitle.value = activeNote.title;
      noteText.value = activeNote.text;
    } else {
      noteTitle.removeAttribute('readonly');
      noteText.removeAttribute('readonly');
      noteTitle.value = "";
      noteText.value = "";
    }
  };

  const actionSaveNote = () => {
    const newNote = {
      title: noteTitle.value,
      text: noteText.value,
    }
    saveNote(newNote).then(()=> {
      getAndRenderNotes();
      showActiveNote();
    });
  };

  const actionDeleteNote = (e) => {
    e.stopPropagation();
    const note = e.target;
    const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;
    if (activeNote.id === noteId) {
      activeNote = {}
    }
    deleteNote(noteId).then(() => {
      getAndRenderNotes();
      showActiveNote();
    });
  };

  const viewNotes = (e) => {
    activeNote = {};
    showActiveNote();
  }

  const renderSaveBtn = () => {
    if (!noteTitle.value.trim() || !noteText.value.trim()) {
      hide(saveBtn);
    } else{
      show(saveBtn);
    }
  }
  const renderNoteList = async (notes) => {
    let allNotes = await notes.json();
    if (window.location.pathname ==='/notes') {
      noteList.forEach((el) => (el.innerHTML = ''));
    }
    let noteListItems = [];
    const createLi = (text, delBtn = true) => {
      const listEl = document.createElement('li');
      listEl.classList.add('list-group-item');
      const spanEl = document.createElement('span');
      spanEl.classList.add('list-item-title');
      spanEl.innerText = text;
      spanEl.addEventListener('click', viewNotes())
      listEl.append(spanEl);

      if (delBtn) {
        const delBtnEl = document.createElement('i');
        delBtnEl.classList.add('fas','fa-trash-alt','float-right','text-danger','delete-note');
        delBtnEl.addEventListener('click', actionDeleteNote)
        listEl.append(delBtnEl)
      }
      return listEl;
    };

    if (allNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  allNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }

  };
  const getAndRenderNotes = () => getNote().then(renderNoteList);

if (window.location.pathname === '/notes') {
  saveBtn.addEventListener('click', actionSaveNote);
  newBtn.addEventListener('click', viewNotes);
  noteTitle.addEventListener('keyup', renderSaveBtn);
  noteText.addEventListener('keyup', renderSaveBtn);
}

getAndRenderNotes();
