// I made a typo, it should've been Inventory but I realized
// too late and I just rolled with it

import React from 'react';
import AddFishForm from './AddFishForm';
import base from '../base';
import { PopupboxManager, PopupboxContainer } from 'react-popupbox';  

class Invetory extends React.Component {

  constructor() {
    super();
    this.updateFishesForm = this.updateFishesForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.authHandler = this.authHandler.bind(this);
    // this.openPopupbox = this.openPopupbox.bind(this);
    this.logout = this.logout.bind(this);

    this.state = {
      uid: null,
      owner: null
    }
  }

  handleChange(e, key) {
    const fish = this.props.fishes[key];
    const updatedFish = {
      ...fish,
      [e.target.name]: e.target.value
    }

    this.props.updateFish(key, updatedFish);
  }

  logout() {
    base.unauth();
    this.setState({ uid: null });
  }

  componentDidMount() {
    base.onAuth((user) => {
      if(user) {
        this.authHandler(null, { user });
      }
    });
  }

  authenticate(provider) {
    base.authWithOAuthPopup(provider, this.authHandler);
  }

  authHandler(err, authData) {
    console.log(authData);

    if (err) {
      console.log(err);
      return;
    }

    const storeRef = base.database().ref(this.props.storeId);

    storeRef.once('value', (snapshot) => {
      const data = snapshot.val() || {};

      if(!data.owner) {
        storeRef.set({
          owner: authData.user.uid
        });
      }
    
      this.setState({
        uid: authData.user.uid,
        owner: data.owner || authData.user.uid
      })
    });
  }

   renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your store's inventory</p>
        <button className="github" onClick={() => this.authenticate('github')}>Log In with Github</button>
      </nav>
    )
  }

  updateFishesForm(key) {

    const fish = this.props.fishes[key];

    return(
      <div className="fish-edit" key={key}>
        <input type="text" name="name" onChange={(e) => this.handleChange(e, key)} placeholder="Fish name" value={fish.name}/>
        <input type="text" name="price" onChange={(e) => this.handleChange(e, key)} placeholder="Fish price" value={fish.price}/>
        <select type="text" name="status" onChange={(e) => this.handleChange(e, key)} placeholder="Fish status" value={fish.status}>
          <option value="available">Fresh</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea type="text" name="desc" onChange={(e) => this.handleChange(e, key)} placeholder="Fish desc" value={fish.desc}> </textarea>
        <input type="text" name="image" onChange={(e) => this.handleChange(e, key)} placeholder="Fish image" value={fish.image}/>
      
        <button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
      </div>
    )
  }

  openPopupbox = () => {
    const content = (
      <div>
        <p className="quotes">Work like you don't need the money.</p>
        <p className="quotes">Dance like no one is watching.</p>
        <p className="quotes">And love like you've never been hurt.</p>
        <span className="quotes-from">― Mark Twain</span>
      </div>
    )
    PopupboxManager.open({ content })
  }

  render() {


    const logout = <button onClick={this.logout}>Log Out!</button>;
    // check if they are no logged in at all
    if(!this.state.uid) {
      return <div>{this.renderLogin()}</div>
    }
    // Check if they are the owner of the current store
    if(this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry you aren't the owner of this store!</p>
          {logout}
        </div>
      )
    }

    return (
      <div>
        {logout}
        <h2>Invetory</h2>
          
         <button onClick={this.openPopupbox}>Click me</button>
          <PopupboxContainer />

        {Object.keys(this.props.fishes).map(this.updateFishesForm)}


        <AddFishForm addFish={this.props.addFish} />
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    )

  }
}

Invetory.propTypes = {
  updateFish: React.PropTypes.func.isRequired,
  removeFish: React.PropTypes.func.isRequired,
  fishes: React.PropTypes.object.isRequired,
  addFish: React.PropTypes.func.isRequired,
  loadSamples: React.PropTypes.func.isRequired
};

export default Invetory;
