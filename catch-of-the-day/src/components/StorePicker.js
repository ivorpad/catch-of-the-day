import React from 'react';
import { getFunName } from '../helpers';

class StorePicker extends React.Component {

  goToStore(e) {
    // grab test from box
    // transition from to :storeId
    e.preventDefault();
    const storeId = this.storeInput.value;

    this.context.router.transitionTo(`/store/${storeId}`)
    console.log(this.context);

  }

  render() {
    return(
      <form className="store-selector" onSubmit={this.goToStore.bind(this)}>
        <h2>Please enter a store</h2>
        <input type="text" required placeholder="Store name" defaultValue={ getFunName() } ref={(input) => { this.storeInput = input }} />
        <button type="submit">Visit Store</button>
      </form>
    )
  }
}

StorePicker.contextTypes = {
  router: React.PropTypes.object
};

export default StorePicker;
