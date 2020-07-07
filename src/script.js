

const signIn = document.querySelector('#sign-in')

signIn.addEventListener('click', e => {
  e.preventDefault()
  // console.log('button')
  fetch(`http://localhost:3000/api/v1/users`)
  .then(r => r.json())
  .then(data => console.log(data))
})