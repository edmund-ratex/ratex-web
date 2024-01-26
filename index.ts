import Big from 'big.js';
import {firstValueFrom} from 'rxjs';
import {Contract, BrowserProvider, MaxUint256, formatEther, parseUnits, parseEther} from 'ethers';
import {env} from '@fd/env';
import {deposit as depositReq, withdraw as withdrawReq} from '@fd/api/asset';
import {allChains$, currentChain$, getChain, getChainByKey, updateCurrentChain} from '@fd/streams/chain';
import terc20Abi from './abi/TERC20.json';
import nftAbi from './abi/RubyDexOGGemNFT.json';
import vaultImplementationAbi from './abi/VaultImplementation.json';

declare global {
  interface Window {
    ethereum: any;
  }
}

export async function connect() {
  if (!env.isBrowser) {
    return null;
  }

  const currentChain = await getCurrentChain();
  const chain = await getNetwork();
  if (currentChain.id !== chain.chainId) {
    const success = await switchChain(currentChain.id);
    if (!success) {
      // TODO: Toast error
      console.log('switch chain failed');
      return;
    }
  }

  const provider = createBrowserProvider();
  await provider.send('eth_requestAccounts', []);
  const signer = await provider.getSigner();

  return {
    provider,
    signer,
    sign(message: string): Promise<string> {
      return signer.signMessage(message);
    },
  };
}

const NFT_ADDRESS = env.isServer || env.isProduction ? '0x28084B501E176F63723D735AaB2511133a4EB00F' : '0x36068945d2b6Fb3d43514295e7685E53E04aF91a';

export async function mint(amount: string) {
  const provider = createBrowserProvider();
  const signer = await provider.getSigner();
  const currentChain = await getCurrentChain();
  const contract = new Contract(currentChain.addressOfUSDT, terc20Abi, signer);
  const myAddress = await signer.getAddress();
  console.log('mint params:', myAddress, parseUnits(amount, currentChain.scale).toString());
  const transaction = await contract.mint(myAddress, parseUnits(amount, currentChain.scale));
  console.log('mint', transaction);
}

export async function approve() {
  const provider = createBrowserProvider();
  const signer = await provider.getSigner();
  const currentChain = await getCurrentChain();
  const contract = new Contract(currentChain.addressOfUSDT, terc20Abi, signer);
  console.log('approve params:', currentChain.addressOfVAULT, MaxUint256.toString());
  const transaction = await contract.approve(currentChain.addressOfVAULT, MaxUint256);
  console.log('approve', transaction);
}

export async function getAllowanceAmount(): Promise<bigint> {
  const provider = createBrowserProvider();
  const signer = await provider.getSigner();
  const currentChain = await getCurrentChain();
  const contract = new Contract(currentChain.addressOfUSDT, terc20Abi, signer);
  const myAddress = await signer.getAddress();
  const result = await contract.allowance(myAddress, currentChain.addressOfVAULT);
  console.log('allowanceAmount:', result.toString(), myAddress, currentChain.addressOfVAULT);
  return result;
}

export async function deposit(amount: string, chainId: bigint) {
  const provider = createBrowserProvider();
  const signer = await provider.getSigner();
  const allChains = await getAllChains();
  const chain = getChain(allChains, chainId);
  const contract = new Contract(chain.addressOfVAULT, vaultImplementationAbi, signer);
  if (chain.key === 'Linea') {
    const feeData = await provider.getFeeData();
    const gasPrice = (feeData.gasPrice * 115n) / 100n;
    console.log('deposit params', chain.addressOfUSDT, amount, parseUnits(amount, chain.scale).toString(), gasPrice);
    const transaction = await contract.deposit(chain.addressOfUSDT, parseUnits(amount, chain.scale), {gasPrice});
    const result = await depositReq(transaction.hash, transaction.nonce, String(chain.id));
    console.log('deposit', amount, parseUnits(amount, chain.scale).toString(), transaction, result);
    return result;
  }
  console.log('deposit params', chain.addressOfUSDT, amount, parseUnits(amount, chain.scale).toString());
  const transaction = await contract.deposit(chain.addressOfUSDT, parseUnits(amount, chain.scale));
  const result = await depositReq(transaction.hash, transaction.nonce, String(chain.id));
  console.log('deposit', amount, parseUnits(amount, chain.scale).toString(), transaction, result);
  return result;
}

export async function withdraw(amount: string, chainId: bigint) {
  const allChains = await getAllChains();
  const chain = getChain(allChains, chainId);
  const result = await withdrawReq(amount, String(chain.id));
  if (result.fail) {
    return;
  }
  const {expiry, nonce, sign} = result.data;
  console.log('withdraw resp:', {expiry, nonce, sign});
  const provider = createBrowserProvider();
  const signer = await provider.getSigner();
  const contract = new Contract(chain.addressOfVAULT, vaultImplementationAbi, signer);
  if (chain.key === 'Linea') {
    console.log('withdraw params:', chain.addressOfUSDT, parseUnits(amount, chain.scale).toString(), Number(expiry), nonce, sign);
    const feeData = await provider.getFeeData();
    const gasPrice = (feeData.gasPrice * 115n) / 100n;
    const transaction = await contract.withdraw(chain.addressOfUSDT, parseUnits(amount, chain.scale), Number(expiry), nonce, sign, {gasPrice});
    console.log('withdraw', amount, parseUnits(amount, chain.scale).toString(), transaction);
    return;
  }
  console.log('withdraw params:', chain.addressOfUSDT, parseUnits(amount, chain.scale).toString(), Number(expiry), nonce, sign);
  const transaction = await contract.withdraw(chain.addressOfUSDT, parseUnits(amount, chain.scale), Number(expiry), nonce, sign);
  console.log('withdraw', amount, parseUnits(amount, chain.scale).toString(), transaction);
}

export async function getNFTInfo(): Promise<NFTInfo> {
  if (!env.isBrowser) {
    return null;
  }

  const allChains = await getAllChains();
  const chain = getChainByKey(allChains, 'Arbitrum');
  const provider = createBrowserProvider();
  const network = await provider.getNetwork();
  const result: any = {};
  if (network.chainId === chain.id) {
    const signer = await provider.getSigner();
    const myAddress = await signer.getAddress();
    const contract = new Contract(NFT_ADDRESS, nftAbi.abi, signer);
    const maxSupply = await contract.maxSupply();
    const balanceOf = await contract.balanceOf(myAddress);
    const reservedNFTs = await contract.reservedNFTs();
    const discountMintPrice = await contract.discountMintPrice();
    const publicMintPrice = await contract.publicMintPrice();
    const totalSupply = await contract.totalSupply();
    const freeMintStartTime = await contract.freeMintStartTime();
    const discountMintStartTime = await contract.discountMintStartTime();
    const publicMintStartTime = await contract.publicMintStartTime();
    const mintEndTime = await contract.mintEndTime();
    const freeMintWhitelist = await contract.freeMintWhitelist(myAddress);
    const discountMintWhitelist = await contract.discountMintWhitelist(myAddress);
    result.freeMintStartTime = freeMintStartTime.toString();
    result.discountMintStartTime = discountMintStartTime.toString();
    result.publicMintStartTime = publicMintStartTime.toString();
    result.mintEndTime = mintEndTime.toString();
    result.maxSupply = maxSupply.toString();
    result.reservedNFTs = reservedNFTs.toString();
    result.discountMintPrice = formatEther(discountMintPrice);
    result.publicMintPrice = formatEther(publicMintPrice);
    result.totalSupply = totalSupply.toString();
    result.balanceOf = balanceOf.toString();
    result.freeMintWhitelist = freeMintWhitelist.toString();
    result.discountMintWhitelist = discountMintWhitelist.toString();
    result.percent = Number(
      Big(totalSupply.toString() * 100)
        .div(maxSupply.toString())
        .toFixed(0)
    );
  }
  if (network.chainId !== chain.id) {
    result.chainError = "Your current wallet's chain is not Arbitrum One. Please switch to Arbitrum One.";
  }
  return result;
}

export async function mintNFT(amount) {
  const chainId = env.isProduction ? 42161n : 421613n;
  const provider = createBrowserProvider();
  const network = await provider.getNetwork();
  if (network.chainId !== chainId) {
    return {error: "Your current wallet's chain is not Arbitrum One. Please switch to Arbitrum One.", success: false};
  }
  const signer = await provider.getSigner();
  const contract = new Contract(NFT_ADDRESS, nftAbi.abi, signer);
  try {
    const result = await contract.mint({value: parseEther(amount)});
    return {success: true, data: result};
  } catch (e) {
    return {error: e.data?.message, success: false};
  }
}

export function listenNetworkChanged() {
  const provider = new BrowserProvider(window.ethereum, 'any');
  provider.on('network', (newNetwork, oldNetwork) => {
    if (oldNetwork) {
      window.location.reload();
    }
  });
}

export function getNetwork() {
  const provider = createBrowserProvider();
  return provider.getNetwork();
}

export async function switchChain(chainId: bigint) {
  const allChains = await getAllChains();
  const chainIdStr = '0x' + chainId.toString(16);
  const provider = resolveMetaMaskProvider();
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{chainId: chainIdStr}],
    });
    updateCurrentChain(allChains, chainId);
    return true;
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        const chain = getChain(allChains, chainId);
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: chainIdStr,
              chainName: chain.name,
              rpcUrls: chain.rpcUrls,
              blockExplorerUrls: chain.blockExplorerUrls,
              nativeCurrency: chain.nativeCurrency,
            },
          ],
        });
        updateCurrentChain(allChains, chainId);
        return true;
      } catch (addError) {
        console.error('addError:', addError);
        // handle "add" error
      }
    }
    console.error('switchError:', switchError);
    // handle other "switch" errors
  }
  return false;
}

export function watchChainChange(handler: (chainId: bigint) => void) {
  if (window.ethereum) {
    window.ethereum.on('chainChanged', (chainId: string) => handler(BigInt(parseInt(chainId, 16))));
  }
}

export async function getBalance() {
  const provider = createBrowserProvider();
  const signer = await provider.getSigner();
  const myAddress = await signer.getAddress();

  const balance = await provider.getBalance(myAddress);
  // convert a currency unit from wei to ether
  const balanceInEth = formatEther(balance);
  console.log(`balance: ${balanceInEth} ETH`);
  console.log(balanceInEth);
}

export function getCurrentChain() {
  return firstValueFrom(currentChain$);
}

export function getAllChains() {
  return firstValueFrom(allChains$);
}

export function createBrowserProvider() {
  return new BrowserProvider(resolveMetaMaskProvider());
}

function resolveMetaMaskProvider() {
  return window.ethereum?.providers?.find((provider) => provider.isMetaMask) || window.ethereum;
}
