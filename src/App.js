import twitterLogo from './assets/twitter-logo.svg'
import './App.css'
import { useEffect, useState } from 'react'
import idl from './idl.json'
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'
import { Program, Provider, web3 } from '@project-serum/anchor'
import Connected from './Connected'

// Constants
const TWITTER_HANDLE = '_buildspace'
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`

const TEST_GIFS = [
  'https://media.giphy.com/media/BZl097s905ay7sJAL4/giphy.gif',
  'https://media.giphy.com/media/F3G8ymQkOkbII/giphy.gif',
  'https://media.giphy.com/media/4wAO1N5uusbMQ/giphy.gif',
]

const { SystemProgram, Keypair } = web3
let baseAccount = Keypair.generate()
const programId = new PublicKey(idl.metadata.address)
const network = clusterApiUrl('devnet')
const opts = {
  preflightCommitment: 'processed',
}

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

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment)
    const provider = new Provider(
      connection,
      window.solana,
      opts.preflightCommitment
    )
    return provider
  }

  const createGifAccount = async () => {
    try {
      const provider = getProvider()
      const program = new Program(idl, programId, provider)
      console.log('ping')
      await program.rpc.startStuffOff({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount],
      })
      console.log(
        'Created a new BaseAccount w/ address:',
        baseAccount.publicKey.toString()
      )
      await getGifList()
    } catch (error) {
      console.log('Error creating BaseAccount account:', error)
    }
  }

  const getGifList = async () => {
    try {
      const provider = getProvider()
      const program = new Program(idl, programId, provider)
      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      )
      console.log('got the account', account)
      setGifList(account.gifList)
    } catch (error) {
      console.log('Error in getGifList: ', error)
      setGifList(null)
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
      getGifList()

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
            <Connected
              gifs={giftList}
              setGifList={setGifList}
              createGifAccount={createGifAccount}
            />
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
