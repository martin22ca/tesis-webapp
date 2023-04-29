export function setPageTitle(state, { title }) {
  state.title = title
}

export function setClass(state, { classId, year, section }) {
  state.classId = classId
  state.classYear = year
  state.classSection = section
}

export function setDate(state, { date }) {
  state.attDate = date
}

export function setMyClasses(state, { myClasses }) {
  state.myClasses = myClasses
}

export function setEditItem(state, { newEditedObj }) {
  state.editedObj = newEditedObj
}