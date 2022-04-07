const notificationReducer = (state = '', action) => {  
  switch (action.type) {
    case 'SET_MESSAGE':
      return action.data.content
    
    case 'CLEAR_MESSAGE':
      return ''
  
    default:
      return state
  }
}

export const setNotification = (content, time) => {
  return async dispatch => {
    dispatch({
      type: 'SET_MESSAGE',
      data: { content }
    })
    setTimeout(() => {
      dispatch({ type: 'CLEAR_MESSAGE' })
    }, time)
  }
}

export default notificationReducer