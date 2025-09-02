import { Connection, PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import idl from './idl.json';


export const DEFAULT_CLUSTER = 'https://api.devnet.solana.com';


export async function getProvider(clusterUrl = DEFAULT_CLUSTER) {
if (!window.solana) throw new Error('Phantom (or wallet) not found');
const wallet = window.solana;
await wallet.connect();


const connection = new Connection(clusterUrl, 'confirmed');
const provider = new anchor.AnchorProvider(connection, wallet, {
preflightCommitment: 'confirmed',
});
anchor.setProvider(provider);
return provider;
}


export function getProgram(provider, programIdStr) {
const programId = new PublicKey(programIdStr);
return new anchor.Program(idl, programId, provider);
}


export function derivePoolPda(programId, tokenAMint, tokenBMint) {
return PublicKey.findProgramAddressSync(
[Buffer.from('pool'), new PublicKey(tokenAMint).toBuffer(), new PublicKey(tokenBMint).toBuffer()],
new PublicKey(programId)
)[0];
}


export function ataFor(mint, owner, program) {
return anchor.utils.token.associatedAddress({ mint: new PublicKey(mint), owner: new PublicKey(owner) });
}
