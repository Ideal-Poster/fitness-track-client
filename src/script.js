const showRoutines = document.querySelector("#show-routines")
const routineContainer = document.querySelector("#routine-container")
const saveChanges = document.querySelector('#save-changes')
const exerciseList = document.querySelector('#exercise-list')
const selectButton = document.querySelector('#exercise-select')
let exerciseArray = []


const routines = [
  {
    name: "upper body",
    exercises: ["pushups", "pullups", "situps"],
    reps: 10,
    sets: 3
  },
  {
    name: "lower body",
    exercises: ["squats", "lunges", "calf raises"],
    reps: 10,
    sets: 3 
  }
]

showRoutines.addEventListener('click', e => {
  populateList(routines)
})

selectButton.addEventListener('click', e => {
  console.log(exerciseList.value)
})

const populateList = (array) => {
  array.forEach(item => {
    let routineItem = document.createElement('div')
    routineItem.className = "routine"
    routineItem.innerHTML = `
    <h3>${item.name}</h3>
    <p>${item.exercises[0]} - reps: ${item.reps}</p>
    <p>${item.exercises[1]} - reps: ${item.reps}</p>
    <p>${item.exercises[2]} - reps: ${item.reps}</p>
    <p>sets: ${item.sets}</p>
    <br>
    `
    routineContainer.appendChild(routineItem)
  })
}