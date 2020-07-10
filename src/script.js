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

const getRoutines = callback => {
  getExercises()
  fetch("http://localhost:3000/api/v1/routines")
    .then(res => res.json())
    .then(json => {
      json.forEach((routine) => {
        routine.exercises.map((exercise, i) => {
          exercise.joinId = routine.exercise_routines[i].id
        })
        console.log(json);
      })
      renderRoutineList(json)
    })
    .catch(error => console.log('error', error));
}

const getExercises = () => {
  fetch("http://localhost:3000/api/v1/exercises")
    .then(res => res.json())
    .then(json => exercises = json)
    .catch(error => console.log('error', error));
}

const renderExerciseCard = (exercise) => {
  return(`
    <div data-join-id="${exercise.joinId}" class="card exercise-card">
      <div class="card-body">
        <h5 class="card-title">${exercise.name}</h5>
        <p class="card-text">muscle group: ${exercise.muscle_group}</p>
        <button type="button" class="delete-exercise-button btn btn-outline-danger">Delete exercise</button>
      </div>
    </div>
  `)
}

const routineCard = routine => {
  return(`
    <div class="card card-${routine.id}" data-id="${routine.id}">
      <h3 class="card-header">${routine.name}</h3>
      <div class="card-body"><div>
        ${routine.exercises.map(exercise => renderExerciseCard(exercise)).join(' ')}
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
          <button type="button" class="edit-title btn btn-outline-primary btn-sm open-edit-modal" data-toggle="modal" data-target="#edit-routines">Edit Title</button>
          <button type="button" class="delete-btn btn btn-danger">Delete Routine</button>
        </div>  
      </div>
    `
  )
}

const renderRoutineList = json => {
  json.forEach(routine => {
    let routineItem = document.createElement('div')
    routineItem.className = "routine"
    routineItem.innerHTML = routineCard(routine);
    routineContainer.appendChild(routineItem)
    container.addEventListener('click', e => {
      if (e.target.matches('.open-edit-modal')) {
        editModal.dataset.id = e.target.closest(".card").dataset.id
      }
    })
  })
}

const renderRoutine = routine => {
  routineNameInput.closest("form").reset();
  const newRoutineCard = document.createElement('div');
  newRoutineCard.classList = "routine";
  newRoutineCard.innerHTML = routineCard(routine);
  routineContainer.append(newRoutineCard);
  
  const editModalBtn = document.querySelector('.open-edit-modal')
  editModalBtn.addEventListener('click', e => {
    editModal.dataset.id = e.target.closest(".card").dataset.id
  })
}

const postRoutine = (name, callback) => {
  const requestOptions = {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      "name": name
    })
  };
  
  fetch(`${BASE_URL}/routines`, requestOptions)
    .then(res => res.json())
    .then(json => callback(json))
    .catch(error => console.log('error', error));
}

const deleteRoutine = id => {
  const requestOptions = {
    method: 'DELETE',
    headers: { "Content-Type": "application/json" }
  };
  fetch(`${BASE_URL}routines/${id}`, requestOptions)
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
    document.querySelector(`.card-${id}`).parentNode.remove()
}

const patchRoutine = (id, name) => {
  const requestOptions = {
    method: 'PATCH',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({"name":`${name}`})
  };
  fetch(`${BASE_URL}routines/${id}`, requestOptions)
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(error => console.log('error', error));
}

const postExerciseToRoutine = (routineId, exerciseId, callback) => {
  const requestOptions = {
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
        json.exercises = []
        json.name = json.exercise.name
        json.joinId = json.id
      callback(json)
    })
    .catch(error => console.log('error', error));
}

const renderExercise = json => {
  json.muscle_group = json.exercise.muscle_group;
  const card = container.querySelector(`.card-${json.routine_id}`);
  const exercises_container = card.querySelector(".card-body").firstElementChild;
  exercises_container.innerHTML += renderExerciseCard(json);
}

const deleteExercise = id => {
  const requestOptions = {
    method: 'DELETE',
  };

fetch(`http://localhost:3000/api/v1/exercise_routines/${id}`, requestOptions)
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
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
    postExerciseToRoutine(routine_id, select_value, renderExercise);
  } else if (e.target.matches(".delete-exercise-button")) {
    const card = e.target.closest(".exercise-card")
    console.log(card.dataset.joinId);
    deleteExercise(card.dataset.joinId);
    card.remove();
  }
})



getRoutines(renderRoutineList)

