const BASE_URL = "http://localhost:3000/api/v1/"

const showRoutines = document.querySelector("#show-routines")
const routineContainer = document.querySelector("#routine-container")
const newRoutine = document.querySelector('#new-routine')
const modal = document.querySelector('.modal')
const createRoutineForm = modal.querySelector(".new-routine-form")
const exerciseList = document.querySelector('#exercise-list')
const selectButton = document.querySelector('#exercise-select')
const routineNameInput = document.querySelector('#create')
const conatiner = document.querySelector(".container")


getRoutines = callback => {
  fetch("http://localhost:3000/api/v1/routines")
    .then(res => res.json())
    .then(json => renderRoutineList(json))
    .catch(error => console.log('error', error));
}

renderRoutineList = json => {
  json.forEach(item => {
    let routineItem = document.createElement('div')
    routineItem.className = "routine"
    routineItem.innerHTML = `
      <div class="card card-${item.id}" data-routine-id="${item.id}">
        <h3 class="card-header">${item.name}</h3>
        <div class="card-body"> 
          ${item.exercises.map(exercise => {            
            return(`
              <h5 class="card-title">${exercise.name}</h5>
              <h5 class="card-title">muscle group: ${exercise.muscle_group}</h5>
              <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
            `)
          })}
          <form>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <button class="btn btn-outline-secondary" id="exercise-select" type="button">Select</button>
              </div>
              <select class="custom-select" id="exercise-list" placeholder="Exercises" aria-label="Example select with button addon">
                <option selected>Exercise List</option>
                <option value="Pushups">Pushups</option>
                <option value="Pullups">Pullups</option>
                <option value="Sit Ups">Sit Ups</option>
                <option value="Squats">Squats</option>
                <option value="Lunges">Lunges</option>
                <option value="Calf Raises">Calf Raises</option>
              </select>
            </div>
          </form>
          <button type="button" class="delete-btn btn btn-danger">Delete Routine</button>

        </div>
        
      </div>
    `
    routineContainer.appendChild(routineItem)
  })
}

// selectButton.addEventListener('click', e => {
//   console.log('click')
// })

renderRoutine = routine => {
  routineNameInput.closest("form").reset()
  const newRoutineCard = document.createElement('div')
  newRoutineCard.classList = "routine"
  newRoutineCard.innerHTML = `
  <div class="card card-${routine.id}" data-routine-id="${routine.id}">
    <h3 class="card-header">${routine.name}</h3>
      <div class="card-body">
        <form>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <button class="btn btn-outline-secondary" id="exercise-select" type="button">Select</button>
            </div>
            <select class="custom-select" id="exercise-list" placeholder="Exercises" aria-label="Example select with button addon">
              <option selected>Exercise List</option>
              <option value="Pushups">Pushups</option>
              <option value="Pullups">Pullups</option>
              <option value="Sit Ups">Sit Ups</option>
              <option value="Squats">Squats</option>
              <option value="Lunges">Lunges</option>
              <option value="Calf Raises">Calf Raises</option>
            </select>
          </div>
        </form>
        <button type="button" class="delete-btn btn btn-danger">Delete Routine</button>
    </div>
  </div>
  `
  routineContainer.append(newRoutineCard)
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
  fetch(`${BASE_URL}/routines/${id}`, requestOptions)
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
    document.querySelector(`.card-${id}`).remove()
}


modal.addEventListener('click', e => {
  if (e.target.matches('#new-routine')) {
    let routineName = routineNameInput.value
    postRoutine(routineName, renderRoutine)
  }
})

conatiner.addEventListener("click", e => {
  if (e.target.matches(".delete-btn")) {
  const id = e.target.closest(".card").dataset.routineId
  deleteRoutine(id)
    
  }
})



getRoutines(renderRoutineList)