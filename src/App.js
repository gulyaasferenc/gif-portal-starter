import twitterLogo from './assets/twitter-logo.svg'
import './App.css'
import { useEffect, useState } from 'react'

import Connected from './Connected'

// Constants
const TWITTER_HANDLE = '_buildspace'
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`

const TEST_GIFS = [
  'https://media.giphy.com/media/BZl097s905ay7sJAL4/giphy.gif',
  'https://media.giphy.com/media/F3G8ymQkOkbII/giphy.gif',
  'https://media.giphy.com/media/4wAO1N5uusbMQ/giphy.gif',
]

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null)
  const [giftList, setGifList] = useState([])

  const checkSolana = async () => {
    try {
      const { solana } = window
      if (solana?.isPhantom) {
        console.log('Phantom wallet was found!')
        const response = await solana.connect({ onlyIfTrusted: true })
        setWalletAddress(response.publicKey.toString())
        console.log('Connected with Public Key:', response.publicKey.toString())
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const connectWallet = async () => {
    const { solana } = window

    if (solana) {
      const response = await solana.connect()
      console.log('Connected with Public Key:', response.publicKey.toString())
      setWalletAddress(response.publicKey.toString())
    }
  }

  useEffect(() => {
    window.addEventListener('load', checkSolana)
    return () => window.removeEventListener('load', checkSolana)
  }, [])

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...')

      // Call Solana program here.

      // Set state
      setGifList(TEST_GIFS)
    }
  }, [walletAddress])

  return (
    <div className='App'>
      <div className='container'>
        <div className='header-container'>
          <p className='header'>🖼 GIF Portal</p>
          <p className='sub-text'>
            View your GIF collection in the metaverse ✨
          </p>
          {!walletAddress ? (
            <button
              className='cta-button connect-wallet-button'
              onClick={connectWallet}
            >
              Connect to Wallet
            </button>
          ) : (
            <Connected gifs={giftList} setGifList={setGifList} />
          )}
        </div>
        <div className='footer-container'>
          <img alt='Twitter Logo' className='twitter-logo' src={twitterLogo} />
          <a
            className='footer-text'
            href={TWITTER_LINK}
            target='_blank'
            rel='noreferrer'
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  )
}

export default App
