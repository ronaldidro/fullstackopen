import { connect } from 'react-redux'
import { filterChange } from "../reducers/filterReducer"

const style = {
  marginBottom: 10
}

const Filter = (props) => {
  const handleChange = (event) => {
    props.filterChange(event.target.value)
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

const mapDispatchToProps = dispatch => {
  return {
    filterChange: value => {
      dispatch(filterChange(value))
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Filter)