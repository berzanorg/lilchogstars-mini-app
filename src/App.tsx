import { sdk } from '@farcaster/frame-sdk'
import { useEffect } from 'react'
import {
  useAccount,
  useConnect,
  useReadContract,
  useWriteContract,
} from 'wagmi'
import { config } from './wagmi'
import { switchChain } from 'wagmi/actions'

function App() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { writeContract, reset, isPending, isSuccess } = useWriteContract()

  // Connect wallet or switch chain
  useEffect(() => {
    if (isConnected) {
      switchChain(config, { chainId: config.chains[0].id })
    } else {
      connect({ connector: connectors[0] })
    }
  }, [isConnected])

  // Farcaster frame ready
  useEffect(() => {
    sdk.actions.ready()
  }, [])

  // Read balanceOf
  const { data: balanceOf, refetch: refetchBalanceOf } = useReadContract({
    address: '0xF5766771A46766a27D28CB3427e4C27881D48360',
    abi: [
      {
        type: 'function',
        name: 'balanceOf',
        inputs: [{ name: '', type: 'address', internalType: 'address' }],
        outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
        stateMutability: 'view',
      },
    ],
    functionName: 'balanceOf',
    args: [address!],
    query: {
      enabled: !!address,
    },
  })

  // Read totalSupply
  const { data: totalSupply, refetch: refetchTotalSupply } = useReadContract({
    address: '0xF5766771A46766a27D28CB3427e4C27881D48360',
    abi: [
      {
        type: 'function',
        name: 'totalSupply',
        inputs: [],
        outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
        stateMutability: 'view',
      },
    ],
    functionName: 'totalSupply',
    args: [],
  })

  // Refresh supply every 7s
  useEffect(() => {
    if (!totalSupply) return
    const id = setInterval(refetchTotalSupply, 7000)
    return () => clearInterval(id)
  }, [totalSupply])

  // Success alert
  useEffect(() => {
    if (!isSuccess) return
    alert('You minted your NFT!')
    refetchBalanceOf()
    refetchTotalSupply()
  }, [isSuccess])

  // Optional: auto-reconnect inside iframe
  useEffect(() => {
    let id: number
    if (!isConnected && window.self !== window.top) {
      id = setInterval(() => {
        connect({ connector: connectors[0] })
      }, 1500)
    }
    return () => clearInterval(id)
  }, [isConnected])

  // Mint handler
  const handleMint = async (amount: number) => {
    await switchChain(config, { chainId: config.chains[0].id })
    writeContract({
      abi: [
        {
          type: 'function',
          name: 'mint',
          inputs: [{ name: 'quantity', type: 'uint256', internalType: 'uint256' }],
          outputs: [],
          stateMutability: 'nonpayable',
        },
      ],
      address: '0xF5766771A46766a27D28CB3427e4C27881D48360',
      functionName: 'mint',
      args: [BigInt(amount)],
    })
  }

  return (
    <>
      <main className='flex flex-col gap-10 w-full sm:max-w-xs flex-1'>
        <div className='flex-col flex gap-6'>
          <h1 className='font-bold text-center text-5xl'>EWCL </h1>

          <h3 className='font-bold text-2xl text-center tabular-nums'>
            {(totalSupply ?? 0).toLocaleString()} minted
          </h3>

          <div className='flex px-4'>
            <img
              className='rounded-2xl aspect-square drop-shadow-[0px_0px_1rem_#2d235acc]'
              src='/ewcl.JPG'
            />
          </div>

          <h3 className='font-bold text-2xl text-center tabular-nums'>
            You minted: x{balanceOf?.toString() || '?'}
          </h3>
        </div>

        {isConnected ? (
          <div className='flex flex-col gap-3'>
            {[1, 10, 100, 1000, 3000].map((amount) => (
              <button
                key={amount}
                onClick={() => handleMint(amount)}
                className='bg-[#362e6f] text-white font-semibold text-2xl h-14 px-7 rounded-2xl drop-shadow-[0px_0px_1rem_#2d235acc]'
              >
                Mint {amount}
              </button>
            ))}
          </div>
        ) : (
          <div className='flex px-4 flex-col'>
            <p className='text-center'>Connect wallet to mint</p>
          </div>
        )}
      </main>

      <footer className='flex flex-col gap-12 w-full items-center text-center'>
        <div className='flex items-center gap-6'>
          <a href='https://x.com/pratiksharma95' target='_blank' className='w-10'>
            <img src='/x-icon.svg' alt='X' />
          </a>
        </div>
      </footer>
    </>
  )
}

export default App
