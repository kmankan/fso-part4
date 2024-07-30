import contactServices from '../services/contacts'

const RemoveContact = ({id, name, setPersons, persons, setNotification, setError}) => {
  const deleteThisPerson = (event) => {
    event.preventDefault();
    console.log(id, name)
    if (window.confirm(`Delete ${name}?`)) {
      contactServices
        .deleteContact(id)
        .then(returnedObject => {
          // check the correct object was added
          console.log('deleted: ', returnedObject);
          // update the person array to remove the deleted entry
          setPersons(persons.filter(person => person.id !== id));
          setNotification(`Removed contact '${name}'`);
        })
        .catch(error => {
          setError(true);
          setPersons(persons.filter(person => person.id !== id));
          if (error.response && error.response.status === 404) {
            setNotification(`${name} does not exist`)
          } else {
              // Generic error message
              setNotification('An error occurred while trying to update the contact. Please try again.');
          }
        })
  }
  };

  return (
      <div>
        <button onClick={deleteThisPerson}>delete</button>
      </div>  
  );
};

export default RemoveContact;