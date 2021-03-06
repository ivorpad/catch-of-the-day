import React from 'react';
import Header from './Header';
import Order from './Order';
import Invetory from './Invetory';
import sampleFishes from '../sample-fishes';
import Fish from './Fish';
import base from '../base';

class App extends React.Component {

  constructor(props) {
    super();

    // same as this.addFish = this.addFish.bind(this);
    this.addFish = this.addFish.bind(this);
    this.loadSamples = this.loadSamples.bind(this);
    this.addToOrder = this.addToOrder.bind(this);
    this.updateFish = this.updateFish.bind(this);
    this.removeFish = this.removeFish.bind(this);
    this.removeOrder = this.removeOrder.bind(this);

    this.state = {
      fishes: {},
      order: {},
      loading: true  
    }
  }

  addFish(fish) {
    //save our current state for performance
    //using the spread attributes from JSX
    //Note: Spread for Objects is not yet available in ES6
    //but is proposed for ES7
    const fishes = {...this.state.fishes};
    const timestamp = Date.now();
    fishes[`fish-${timestamp}`] = fish;

    this.setState({ fishes: fishes });
    // I can do this too: this.setState({ fishes });
  }

  updateFish(key, updatedFish) {
    const fishes = {...this.state.fishes};
    fishes[key] = updatedFish;

    this.setState({ fishes });
  }


  removeFish(key) {
    const fishes = {...this.state.fishes};
    fishes[key] = null;
    this.setState({ fishes });
  }

  removeOrder(key) {
    const order = {...this.state.order};
    delete order[key];
    this.setState({order});
  }

  loadSamples() {
    this.setState({
      fishes: sampleFishes
    });
  }

  addToOrder(key) {
    const order = {...this.state.order};
    order[key] = order[key] + 1 || 1;
    this.setState({ order: order })
  }

  componentWillMount() {
    this.ref = base.syncState( `${this.props.params.storeId}/fishes`
    , {
      context: this,
      state: 'fishes',
      then() {
        this.setState({ loading: false });
      }
    });

    // check if there is any order in localStorage
    const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);

    if(localStorageRef) {
      // update our App component's order state
      this.setState({
        order: JSON.parse(localStorageRef)
      });
    }

  }

  componentWillUnmount() {
    base.removeBiding(this.ref)
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
  }


  render() {
    const { loading } = this.state;
    if (loading) {
      return (
        <div>LOADING...</div>
      );
    }

    return(
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Let's go fishes"/>
          <ul className="list-of-fishes">
            { 
              Object.keys(this.state.fishes)
              .map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>)  

              // .map(function(key) {
              //   return <Fish />
              // })
            }
          </ul>
        </div>

        <Order 
          fishes={this.state.fishes} 
          order={this.state.order}
          params={this.props.params}
          removeOrder={this.removeOrder}
          />
        <Invetory 
          addFish={this.addFish} 
          loadSamples={this.loadSamples} 
          fishes={this.state.fishes}
          updateFish={this.updateFish}
          removeFish={this.removeFish}
          storeId={this.props.params.storeId}
          />
      </div>
    )
  }
}

App.propTypes = {
  params: React.PropTypes.object.isRequired
};

export default App;
