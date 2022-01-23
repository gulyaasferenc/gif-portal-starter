import { useState } from 'react'

const Connected = ({
  gifs,
  getGifList,
  createGifAccount,
  getProvider,
  baseAccount,
  idl,
  Program,
  programId,
}) => {
  const [inputValue, setInputvalue] = useState('')

  const onInputChange = (event) => {
    setInputvalue(event.target.value)
  }

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log('Gif link:', inputValue)
      try {
        const provider = getProvider()
        const program = new Program(idl, programId, provider)
        await program.rpc.addGif(inputValue, {
          accounts: {
            baseAccount: baseAccount.publicKey,
            user: provider.wallet.publicKey,
          },
        })
        await getGifList()
      } catch (error) {
        console.log('Send gif error', error)
      } finally {
        setInputvalue('')
      }
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
              <img src={gif.gifLink} alt={gif} />
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default Connected
