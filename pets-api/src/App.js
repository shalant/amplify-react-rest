import React, { useEffect } from 'react';
import './App.css';
import {Amplify, API} from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import config from './aws-exports';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(config);
export default function App() {
  const [petName, setPetName] = React.useState('');
  const [petType, setPetType] = React.useState('');
  const [pet, setPets] = React.useState([]);

  useEffect(() => {
    API.get('petsapi', '/pets/name').then((petRes) => {
      setPets([... pet, ... petRes])
    })
  }, []);

  const handleSubmit = e => {
    e.preventDefault()

    API.post('petsapi', '/pets', {
      body: {
        name: petName,
        type: petType
      }
    }).then(() => {
      setPets([ {name: petName, type: petType}, ... pet])
    })
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user.username}</h1>
          <form onSubmit={handleSubmit}>
            <input value={petName} placeholder='fido' onChange={(e) => setPetName(e.target.value)} />
            <input value={petType} placeholder='fido' onChange={(e) => setPetType(e.target.value)} />
            <button>Add Pet</button>
          </form>
          <ul>
            {pet.map(pet => <li>{pet.name}</li>)}
          </ul>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}

// export default withAuthenticator(App);
