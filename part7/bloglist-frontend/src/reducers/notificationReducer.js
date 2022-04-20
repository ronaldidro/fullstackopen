let timeoutID = null

const notificationReducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_MESSAGE':
      return action.data
    
    case 'CLEAR_MESSAGE':
      return ''
  
    default:
      return state
  }
}

export const setNotification = (content, type, time) => {
  return async dispatch => {
    if(timeoutID) clearTimeout(timeoutID)

    dispatch({
      type: 'SET_MESSAGE',
      data: { content, type }
    })

    timeoutID = setTimeout(() => {
      dispatch({ type: 'CLEAR_MESSAGE' })
    }, time * 1000)
  }
}

export default notificationReducer