import contactServices from '../services/contacts'

const PersonForm = ({
  persons, 
  newName, 
  newNumber, 
  setNewName, 
  setNewNumber, 
  setPersons, 
  setNotification,
  setError,
  handleNameChange, 
  handleNumberChange}) => {
  const addPerson = (event) => {
    event.preventDefault();
    if (newName.trim() !== '') {
      // use map to create an array of str names from the persons array of object
      const personsArray = persons.map(nameObject => nameObject.name);
      if (personsArray.includes(newName)) {
        if (window.confirm(`${newName} is aleady in the phonebook. Do you want to replace the old number with this new one?`)) {
          // check if newName is in the existing names array, if so create an alert and do not update state of persons
          const matchingContact = persons.find(person => person.name === newName);
          // check the contact being changed
          console.log(matchingContact);
          // PUT request to update contact details
          contactServices
            .update(
              matchingContact.id, 
              { ...matchingContact, number: newNumber})
            .then(returnedObjects => {
              // check the correct object was added
              console.log('returning: ', returnedObjects);
              //update the persons array with the new entry
              setPersons(persons.map(person => 
                person.id === matchingContact.id ? returnedObjects : person
              ));
              setNotification(`Updated contact '${newName}'`);
              // clear the input fields
              setNewName('');
              setNewNumber('');
            })
            .catch(error => {
              setError(true);
              // specific error if user is not in database
              if (error.response && error.response.status === 404) {
                setNotification(`${newName} no longer exists in the phonebook`)
              } else {
                  // Generic error message
                  setNotification('An error occurred while trying to update the contact. Please try again.');
              }
            });
        }; 

      } else {
          // otherwise, create an object literal with new contact info
          const contactObject = {
            name: newName,
            number: newNumber
          }
          // update the db with new contacts info
          contactServices
            .create(contactObject)
            .then(returnedObjects => {
              // check the correct object was added
              console.log('returning: ', returnedObjects);
              //update the persons array with the new entry
              setPersons([...persons, returnedObjects]);
              // Create notification about event
              setNotification(`Added new contact '${newName}'`)
              // clear the input fields
              setNewName('');
              setNewNumber('');
            })
            .catch(error => {
              console.log('error: ', error)
              setNotification(error.response.data.error);
            })
      };
    };
  };

  return (
    <form onSubmit={addPerson}>
      <div>
        name: 
        <input 
        value={newName} // The value of the input field is controlled by the 'newName' state
        onChange={handleNameChange} // When the input value changes, the 'handleNameChange' function is called
        />
      </div>

      <div>
        number: 
        <input 
        value={newNumber} // same as above but for newNumber
        onChange={handleNumberChange}
        />
      </div>

      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;