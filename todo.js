let currentEditId = null;
let todos = [];
const titleInput = document.getElementById("title");
const descInput = document.getElementById("desc");
const actionBtn = document.getElementById("actionBtn");
const container = document.getElementById("todo-container");
const searchInput = document.getElementById("search");
const errorMessageBtn = document.getElementById("errorMessage");

var newIndex = 0;
//load from localStorage
if(localStorage.getItem("todos") !== null){
  todos = JSON.parse(localStorage.getItem('todos'));
  if(todos.length>0){
    newIndex = todos[todos.length-1].id;
  }
  renderTodos();
}

//Save to localStorage
  function setToLocalStorage(){
    localStorage.setItem("todos", JSON.stringify(todos));
  }

//Validation functions
function validateTitle(title){
  const regexTitle = /^[A-Z][a-z]{3,8}$/; 
  return regexTitle.test(title);
}
function validateDescription(desc){
  return desc.length >= 20;
}
function validationFunction(){
  errorMessageBtn.textContent = "";
  errorMessageBtn.style.display = "none";
  if(!validateTitle(titleInput.value)){
    errorMessageBtn.textContent = "Title must start with a capital letter and be followed by 3 to 8 small letters only.";
    errorMessageBtn.style.display = "block";
    return false;
  }
  if(!validateDescription(descInput.value)){
    errorMessageBtn.textContent = "Description must be at least 20 characters long.";
    errorMessageBtn.style.display = "block";
    return false;
  }
  return true;
}

//Add function
function addTodo() {
  if(!validationFunction()){
    return;
  }

  let title = titleInput.value;
  let desc = descInput.value;

  newIndex++;
  todos.push({ title: title, desc: desc, id: newIndex, done: false });
  clearForm();
  setToLocalStorage();
  renderTodos();
  } 

//Update function
function updateTodo(){
  if(!validationFunction()){
    return;
  }

  let title = titleInput.value;
  let desc = descInput.value;
  
  for(let i=0; i<todos.length; i++){
    if(todos[i].id === currentEditId){
      todos[i].title = title;
      todos[i].desc = desc;
      break;
    }
  }
  //then return the value of currentEditIndex to null to convert to Add
  currentEditId = null;
  actionBtn.textContent = "Add";
  clearForm();
  setToLocalStorage();
  renderTodos();
}

//mark as Done
function markAsDone(id){
  for(let i=0; i<todos.length; i++){
    if(todos[i].id === id){
      todos[i].done = true;
    }
  }
  setToLocalStorage();
  renderTodos();
}
//edit function
function editBtnFun(id){
  for(let i=0; i<todos.length; i++){
    if(todos[i].id === id){
      titleInput.value = todos[i].title;
      descInput.value = todos[i].desc;
      actionBtn.textContent = "Update";
      currentEditId = id;
    }
  }
}
//delete function/////////////////////////////////////////////
function deleteBtn(id){
  for(let i=0; i<todos.length; i++){
    if(todos[i].id === id){
      todos.splice(i, 1);
    }
  }
  setToLocalStorage();
  renderTodos();
}
//addOrUpdate function
function addOrUpdate(){
  if(currentEditId !== null){
    updateTodo();
  }else{
    addTodo();
  }
}
//render function
function renderTodos(id) {
  container.innerHTML = "";

  for (let i = 0; i < todos.length; i++) {
    const todo = todos[i];

    const div = document.createElement("div");
    div.className = "todo";
    if (todo.done === true) {
      div.className += " done";
    }

    const h3 = document.createElement("h3");
    h3.textContent = todo.title;

    const doneBtn = document.createElement("button");
    doneBtn.textContent = "✓";
    doneBtn.onclick = ()=> markAsDone(todo.id);

    const editBtn = document.createElement("button");
    editBtn.textContent = "↥";
    editBtn.onclick = ()=> editBtnFun(todo.id);
    
    const delBtn = document.createElement("button");
    delBtn.textContent = "✖";
    delBtn.onclick = ()=> deleteBtn(todo.id);

    div.appendChild(h3);
    div.appendChild(doneBtn);
    div.appendChild(editBtn);
    div.appendChild(delBtn);
    container.appendChild(div);
  }
}

function clearForm(){
  titleInput.value = '';
  descInput.value = '';
}

//Search function
function searchTodos() {
  const searchTerm = searchInput.value.toLowerCase();
  const searchResults = document.getElementById("searchResults");
  searchResults.innerHTML = "";
  if(searchTerm.trim() === ""){
    renderTodos();
    searchResults.style.display = "none";
    return;
  }

  const matchedTodos = [];

  for (let i = 0; i < todos.length; i++) {
    const titleLower = todos[i].title.toLowerCase();
    const descLower = todos[i].desc.toLowerCase();

    if (titleLower.includes(searchTerm)) {
      matchedTodos.push(todos[i]);
    }

    if(matchedTodos.length === 0){
      container.innerHTML = "<p>No Todos Found.</p>";
      searchResults.style.display = "none";
    }else{
      container.innerHTML="";
      searchResults.style.display = "block";
      for(let i = 0; i< matchedTodos.length; i++){
        const todo = matchedTodos[i];
        const div = document.createElement("div");
        div.className = "todo";
        if (todo.done === true) {
          div.className += " done";
        }
    
        const h3 = document.createElement("h3");
        h3.textContent = todo.title;
    
        const doneBtn = document.createElement("button");
        doneBtn.textContent = "✓";
        doneBtn.onclick = ()=> markAsDone(todo.id);
    
        const editBtn = document.createElement("button");
        editBtn.textContent = "↥";
        editBtn.onclick = ()=> editBtnFun(todo.id);
        
        const delBtn = document.createElement("button");
        delBtn.textContent = "✖";
        delBtn.onclick = ()=> deleteBtn(todo.id);
    
        div.appendChild(h3);
        div.appendChild(doneBtn);
        div.appendChild(editBtn);
        div.appendChild(delBtn);
        container.appendChild(div);
      }
    }
  }

  for(let i = 0; i< matchedTodos.length; i++){
    const list = document.createElement("li");
    list.textContent = matchedTodos[i].title;
    //list.style.padding = "10px";
    list.onclick = function(){
      renderSingleTodo(matchedTodos[i]);
      searchResults.innerHTML="";
      searchInput.value="";
      searchResults.style.display = "none";
    };
    searchResults.appendChild(list);
  }
}

function renderSingleTodo(todo){
  container.innerHTML="";
  const div = document.createElement("div");
    div.className = "todo";
    if (todo.done === true) {
      div.className += " done";
    }

    const h3 = document.createElement("h3");
    h3.textContent = todo.title;

    const doneBtn = document.createElement("button");
    doneBtn.textContent = "✓";
    doneBtn.onclick = ()=> markAsDone(todo.id);

    const editBtn = document.createElement("button");
    editBtn.textContent = "↥";
    editBtn.onclick = ()=> editBtnFun(todo.id);
    
    const delBtn = document.createElement("button");
    delBtn.textContent = "✖";
    delBtn.onclick = ()=> deleteBtn(todo.id);

    div.appendChild(h3);
    div.appendChild(doneBtn);
    div.appendChild(editBtn);
    div.appendChild(delBtn);
    container.appendChild(div);
}

searchInput.addEventListener("input",searchTodos);