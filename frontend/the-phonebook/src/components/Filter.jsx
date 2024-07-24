const Filter = ({persons, setFilterText, setFilteredList, value}) => {
  const handleFilterChanges = (event) => {
    event.preventDefault();
    // Update the filterText state with the current value of the input field
    setFilterText(event.target.value);
    // Store the current value of the input field in a variable for filtering
    const stringToFilterOn = event.target.value;
    // Filter the persons array based on the input value (case-insensitive)
    // check both the name and number arrays for a match
    const filteredArray = persons.filter((personObject) => {
        const lowerCaseName = personObject.name.toLowerCase();
        const findNumber = personObject.number;
        return (
          lowerCaseName.includes(stringToFilterOn.toLowerCase()) ||
          findNumber.includes(stringToFilterOn)
        )
      });
    // Update the filteredList state with the filtered array of persons
      setFilteredList(filteredArray);
  }
  
  return (
    <div>
    filter shown with: 
    <input 
    value={value}
    onChange={handleFilterChanges}
    />
  </div>
);
};

export default Filter;