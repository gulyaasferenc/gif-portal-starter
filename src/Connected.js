import { useState } from 'react'

const Connected = ({ gifs, setGifList, createGifAccount }) => {
  const [inputValue, setInputvalue] = useState('')

  const onInputChange = (event) => {
    setInputvalue(event.target.value)
  }

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log('Gif link:', inputValue)
      setGifList([...gifs, inputValue])
      setInputvalue('')
    } else {
      console.log('Empty input. Try again.')
    }
  }
  if (gifs === null) {
    return (
      <div className='connected-container'>
        <button
          className='cta-button submit-gif-button'
          onClick={createGifAccount}
        >
          Do One-Time Initialization For GIF Program Account
        </button>
      </div>
    )
  } else {
    return (
      <div className='connected-container'>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            sendGif()
          }}
        >
          <input
            value={inputValue}
            onChange={onInputChange}
            type='text'
            placeholder='Enter gif link!'
          />
          <button type='submit' className='cta-button submit-gif-button'>
            Submit
          </button>
        </form>
        <div className='gif-grid'>
          {gifs.map((gif, index) => (
            <div className='gif-item' key={index}>
              <img src={gif} alt={gif} />
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default Connected
