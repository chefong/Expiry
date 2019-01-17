import React from 'react'
import './Filter.css'

const Filter = props => {
  return (
    <div class="filter-container">
      <div className="row justify-content-center">
        <form className="form-inline" onSubmit={ props.handleSubmit }>
          <select className="form-control" name="sortBy" id="sortBy">
            <option>Low - High</option>
            <option>High - Low</option>
            <option>A - Z</option>
            <option>Z - A</option>
          </select>
          <button type="submit" className="btn btn-secondary">Submit</button>
        </form>
      </div>
    </div>
  )
}

export default Filter