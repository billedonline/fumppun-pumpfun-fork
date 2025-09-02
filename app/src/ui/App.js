import React, { useCallback, useEffect, useMemo, useState } from 'react';
const userTo = await ataFor(toMint, wallet.publicKey, program);


const amountIn = BigInt(prompt('Amount in (raw units)?', '100000')); // you can add decimals UI


await program.methods.swap(new anchor.BN(amountIn.toString()), new anchor.BN(0))
.accounts({
user: wallet.publicKey,
pool: poolPda,
lpMint: new PublicKey(vaults.lp),
fromVault,
toVault,
userFromAta: userFrom,
userToAta: userTo,
recycleLpVault: new PublicKey(vaults.recycle),
tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
})
.rpc();
}


async function removeLiquidity(){
const wallet = provider.wallet;
const poolPda = new PublicKey(poolAddr);
const lpMint = new PublicKey(vaults.lp);
const userLp = await ataFor(lpMint, wallet.publicKey, program);
const userA = await ataFor(new PublicKey(tokenA), wallet.publicKey, program);
const userB = await ataFor(new PublicKey(tokenB), wallet.publicKey, program);


const lpAmount = BigInt(prompt('LP amount (raw units)?', '1000'));


await program.methods.removeLiquidity(new anchor.BN(lpAmount.toString()), new anchor.BN(0), new anchor.BN(0))
.accounts({
user: wallet.publicKey,
pool: poolPda,
lpMint,
vaultA: new PublicKey(vaults.a),
vaultB: new PublicKey(vaults.b),
userLpAta: userLp,
userAtaA: userA,
userAtaB: userB,
tokenAMint: new PublicKey(tokenA),
tokenBMint: new PublicKey(tokenB),
tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
})
.rpc();
}


return (
<div style={{maxWidth:900, margin:'40px auto', fontFamily:'Inter, system-ui, -apple-system', padding:20}}>
<h2>Pumpfun‑style AMM (fees → LP recycle)</h2>
<p>Enter your token CA (mint) below. The app derives a pool PDA and vaults. Default quote mint is WSOL devnet.</p>


<div style={{border:'1px solid #eee', borderRadius:12, padding:16}}>
<Row><L>Cluster URL</L><input value={clusterUrl} onChange={e=>setClusterUrl(e.target.value)} /></Row>
<Row><L>Program ID</L><input value={programId} onChange={e=>setProgramId(e.target.value)} /></Row>
<Row><L>Token A (your CA)</L><input value={tokenA} onChange={e=>setTokenA(e.target.value)} placeholder="Mint address"/></Row>
<Row><L>Token B (quote)</L><input value={tokenB} onChange={e=>setTokenB(e.target.value)} placeholder="e.g. WSOL/USDC mint"/></Row>
<Row><L>Fee (bps)</L><input type="number" value={feeBps} onChange={e=>setFeeBps(parseInt(e.target.value||'0'))}/></Row>
<Row><L>Wallet</L>
{!connected
? <Btn onClick={connect}>Connect Phantom</Btn>
: <span>Connected: {provider?.wallet?.publicKey?.toBase58().slice(0,6)}…</span>}
</Row>
</div>


<div style={{marginTop:20, border:'1px solid #eee', borderRadius:12, padding:16}}>
<Row><L>Derived Pool PDA</L><code>{poolAddr || '—'}</code></Row>
<Row><L>Vault A</L><code>{vaults.a || '—'}</code></Row>
<Row><L>Vault B</L><code>{vaults.b || '—'}</code></Row>
<Row><L>LP Mint</L><code>{vaults.lp || '—'}</code></Row>
<Row><L>Recycle LP Vault</L><code>{vaults.recycle || '—'}</code></Row>
<Row><L>Pool Loaded?</L><span>{pool ? 'Yes' : 'No (initialize to create)'}</span></Row>


<div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
<Btn onClick={initPool}>Initialize Pool</Btn>
<Btn onClick={addLiquidity}>Add Liquidity</Btn>
<Btn onClick={()=>swap('AtoB')}>Swap A → B</Btn>
<Btn onClick={()=>swap('BtoA')}>Swap B → A</Btn>
<Btn onClick={removeLiquidity}>Remove Liquidity</Btn>
</div>
</div>


<p style={{marginTop:18, fontSize:12, color:'#666'}}>
⚠️ This code is for educational/testnet purposes. Audit before mainnet. The LP minting for fee recycling uses a
single‑sided approximation to keep on‑chain compute low; you may implement a two‑leg internal rebalance if desired.
</p>
</div>
);
}
