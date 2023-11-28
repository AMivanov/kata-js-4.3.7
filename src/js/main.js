
let arr = []
const searchInput = document.getElementById('search-input')
const itemList = document.getElementById('autocom-box')
const resultList = document.getElementById('results')
resultList.innerHTML = ""

const debounce = (fn, debounceTime) => {
  let timeout
  return function () {
    const fnCall = () => {fn.apply(this, arguments)}
    clearTimeout(timeout)
    timeout = setTimeout(fnCall, debounceTime)
  }
};

searchInput.addEventListener('keyup', debounce((evt) => {
  if (searchInput.value === '') {
    return null
  } else {
    evt.preventDefault()
    searchUsers(evt.target.value)
      .then((response) => {
        dataMapping(response)
        itemList.style.display = 'block'
      })
  }
}, 400))

async function searchUsers(evt) {
    return await fetch(`https://api.github.com/search/repositories?q=${evt}`)
      .then((response) => response.json())
      .then((data) => data.items)
      .catch(err => console.log(err))
}

const createTemplate = (evt, item) => {
  evt.preventDefault()
  const fragment = document.createDocumentFragment()
  const repository = document.createElement('div')
  repository.classList.add('repository-card')
  const nameRepository = document.createElement('p')
  nameRepository.textContent = `Name: ${item.name}`
  const ownerRepository = document.createElement('p')
  ownerRepository.textContent = `Owner: ${item.owner.login}`
  const starsRepository = document.createElement('p')
  starsRepository.textContent = `Stars: ${item.stargazers_count}`
  const deleteButton = document.createElement('div')
  deleteButton.classList.add('delete_button')
  deleteButton.onclick = function(e) {
    resultList.removeChild(repository)
  }
  repository.appendChild(nameRepository)
  repository.appendChild(ownerRepository)
  repository.appendChild(starsRepository)
  repository.appendChild(deleteButton)
  fragment.appendChild(repository)
  return fragment
}
const dataMapping = (data) => {
  if (data) {
    itemList.innerHTML = ""
    data.slice(0, 5).forEach((item) => {
      const li = document.createElement('li')
      li.textContent = item.name
      itemList.appendChild(li)
        .addEventListener('click', (e) => {
          arr.push(createTemplate(e, item))
            arr.forEach(elem => {
                resultList.appendChild(elem)
            })
            searchInput.value = ''
            itemList.style.display = 'none'
        })
    })
  }
}






