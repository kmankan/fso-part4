const Notification = ({ message, error }) => {
  const checkIfUpdateOrError = () => {
    if (error) {
      return 'error'
    } else {
      return 'notification'
    }
  }
  
  if (message === null) {
    return null
  }

  return (
    <div className={checkIfUpdateOrError()}>
      {message}
    </div>
  )
}

export default Notification