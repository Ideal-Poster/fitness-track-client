const showRoutines = document.querySelector("#show-routines")
const routineContainer = document.querySelector("#routine-container")
const saveChanges = document.querySelector('#save-changes')
const exerciseList = document.querySelector('#exercise-list')
const selectButton = document.querySelector('#exercise-select')
let exerciseArray = []

getRoutines = callback => {
  fetch("http://localhost:3000/api/v1/routines")
    .then(res => res.json())
    .then(json => renderRoutineList(json))
    .catch(error => console.log('error', error));
}

// getRoutineExcercises = (id, callback) => {
//   fetch(`http://localhost:3000/api/v1/exercises_for_routine/${id}`)
//     .then(res => res.json())
//     .then(json => callback(id, json))
//     .catch(error => console.log('error', error));
// }

// renderRoutineExercises = (id, json) => {
//   const card = document.querySelector(`.card-${id}`)
//   json.forEach(exercise => {
//     card.insertAdjacentHTML("beforeend", `
//       <div class="card-body"> 
//         <h5 class="card-title">${exercise.name}</h5>
//         <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
//       </div>
//     `)
//   })
// }

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

        </div>
      </div>
    `
    routineContainer.appendChild(routineItem)
  })
}

selectButton.addEventListener('click', e => {
  console.log(exerciseList.value)
})

// showRoutines.addEventListener('click', e => {
//   populateList(routines)
// })

routineContainer.addEventListener('click', e => {
  if (e.target.matches(".card-header")) {
    const id = e.target.closest(".card").dataset.routineId
    console.log(e.target.nextElementSibling);
    
  }
})


getRoutines(renderRoutineList)