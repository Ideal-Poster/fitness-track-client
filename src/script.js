const BASE_URL = "http://localhost:3000/api/v1/"

const showRoutines = document.querySelector("#show-routines")
const routineContainer = document.querySelector("#routine-container")
const newRoutine = document.querySelector('#new-routine')
const modal = document.querySelector('.modal')
const editModal = document.querySelector('#edit-routines')
const createRoutineForm = modal.querySelector(".new-routine-form")
const exerciseList = document.querySelector('#exercise-list')
const selectButton = document.querySelector('#exercise-select')
const routineNameInput = document.querySelector('#create')
const newRoutineNameInput = document.querySelector('#edit')
const container = document.querySelector(".container")

let exercises = []

getRoutines = callback => {
  getExercises()

  fetch("http://localhost:3000/api/v1/routines")
    .then(res => res.json())
    .then(json => renderRoutineList(json))
    .catch(error => console.log('error', error));
}

getExercises = () => {
  fetch("http://localhost:3000/api/v1/exercises")
    .then(res => res.json())
    .then(json => exercises = json)
    .catch(error => console.log('error', error));
}

renderRoutineList = json => {
  json.forEach(routine => {
    let routineItem = document.createElement('div')
    routineItem.className = "routine"
    routineItem.innerHTML = `
      <div class="card card-${routine.id}" data-id="${routine.id}">
        <h3 class="card-header">${routine.name}</h3>
          <button type="button" class="btn btn-outline-primary btn-sm open-edit-modal" data-toggle="modal" data-target="#edit-routines">Edit Title</button>
        <div class="card-body"><div>
          ${routine.exercises.map(exercise => {            
            return(`
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">${exercise.name}</h5>
                <p class="card-text">muscle group: ${exercise.muscle_group}</p>
                <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
              </div>
            </div>
            `)
          })}
        </div>
      <div class="card-footer">
        <form>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <button class="btn btn-outline-secondary" id="exercise-select" type="button">Select</button>
            </div>
            <select class="custom-select" id="exercise-list" placeholder="Exercises" aria-label="Example select with button addon">
              ${exercises.map(exercise => {
                return `<option value="${exercise.id}">${exercise.name}</option>`
              })}
            </select>
          </div>
        </form>
        <button type="button" class="delete-btn btn btn-danger">Delete Routine</button>
      </div>  
    </div>
    `
    routineContainer.appendChild(routineItem)
    
    container.addEventListener('click', e => {
      if (e.target.matches('.open-edit-modal')) {
      editModal.dataset.id = e.target.closest(".card").dataset.id
      }
    })
    
  })
}

renderRoutine = routine => {
  routineNameInput.closest("form").reset()
  const newRoutineCard = document.createElement('div')
  newRoutineCard.classList = "routine"
  newRoutineCard.innerHTML = `
  <div class="card card-${routine.id}" data-id="${routine.id}">
    <h3 class="card-header">${routine.name}</h3>
      <button type="button" class="btn btn-outline-primary btn-sm open-edit-modal" data-toggle="modal" data-target="#edit-routines">Edit Title</button>
      <div class="card-body">
      </div>
      <div class="card-footer">
        <form>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <button class="btn btn-outline-secondary" id="exercise-select" type="button">Select</button>
            </div>
            
            <select class="custom-select" id="exercise-list" placeholder="Exercises" aria-label="Example select with button addon">
              ${exercises.map(exercise => {
                return `<option value="${exercise.id}">${exercise.name}</option>`
              })}
            </select>
          </div>
        </form>
        <button type="button" class="delete-btn btn btn-danger">Delete Routine</button>
    </div>
  </div>
  `
  routineContainer.append(newRoutineCard)
  
  const editModalBtn = document.querySelector('.open-edit-modal')
  
  editModalBtn.addEventListener('click', e => {
  editModal.dataset.id = e.target.closest(".card").dataset.id
  })
}


postRoutine = (name, callback) => {
  var requestOptions = {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({"name":`${name}`})
  };
  
  fetch(`${BASE_URL}/routines`, requestOptions)
    .then(res => res.json())
    .then(json => callback(json))
    .catch(error => console.log('error', error));
}

deleteRoutine = id => {
  var requestOptions = {
    method: 'DELETE',
    headers: { "Content-Type": "application/json" }
  };
  fetch(`${BASE_URL}routines/${id}`, requestOptions)
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
    document.querySelector(`.card-${id}`).parentNode.remove()
}

patchRoutine = (id, name) => {
  var requestOptions = {
    method: 'PATCH',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({"name":`${name}`})
  };
  fetch(`${BASE_URL}routines/${id}`, requestOptions)
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(error => console.log('error', error));
}

postExerciseToRoutine = (routineId, exerciseId, callback) => {
  var requestOptions = {
    method: 'POST',
    headers:{
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "routine_id": routineId,
      "exercise_id": exerciseId
    })
  };

  fetch("http://localhost:3000/api/v1/exercise_routines", requestOptions)
    .then(res => res.json())
    .then(json => {
      console.log(json);
      
      callback(json)
    })
    .catch(error => console.log('error', error));
}

renderExercise = (json) => {
  console.log(exercises);
  
  const card = container.querySelector(`.card-${json.routine_id}`)
  const exercises_container = card.querySelector(".card-body").firstElementChild
  exercises_container.innerHTML += `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">${exercises[json.exercise_id - 1].name}</h5>
        <p class="card-text">muscle group: ${exercises[json.exercise_id - 1].muscle_group}</p>
        <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
      </div>
    </div>
  `
  // card.querySelector().
}


modal.addEventListener('click', e => {
  if (e.target.matches('#new-routine')) {
    let routineName = routineNameInput.value
    postRoutine(routineName, renderRoutine)
  }
})

editModal.addEventListener('click', e => {
  if (e.target.matches('#edit-routine')) {
    let id = editModal.dataset.id
    let newRoutineName = newRoutineNameInput.value
    const titleTarget = container.querySelector(`.card-${id}`).firstElementChild
    titleTarget.textContent = newRoutineName
    patchRoutine(id, newRoutineName)
  }
})

container.addEventListener("click", e => {
  if (e.target.matches(".delete-btn")) {
    const id = e.target.closest(".card").dataset.id;
    deleteRoutine(id);
  } else if (e.target.matches("#exercise-select")) {
    const routine_id = e.target.closest(".card").dataset.id;
    const select_value = e.target.closest(".input-group-prepend").nextElementSibling.value;
    console.log(select_value, routine_id);
    postExerciseToRoutine(routine_id, select_value, renderExercise);
  }
})



getRoutines(renderRoutineList)

