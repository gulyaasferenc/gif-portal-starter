import { useState } from 'react'

const Connected = ({ gifs, setGifList }) => {
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
        {gifs.map((gif) => (
          <div className='gif-item' key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Connected
