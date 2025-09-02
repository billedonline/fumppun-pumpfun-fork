use anchor_lang::prelude::*;
},
),
lp_amount,
)?;


let amount_a = (u128::from(ctx.accounts.vault_a.amount) * u128::from(lp_amount)
/ u128::from(lp_supply)) as u64;
let amount_b = (u128::from(ctx.accounts.vault_b.amount) * u128::from(lp_amount)
/ u128::from(lp_supply)) as u64;


require!(amount_a >= min_a && amount_b >= min_b, AmmError::Slippage);


token::transfer(
CpiContext::new_with_signer(
ctx.accounts.token_program.to_account_info(),
Transfer {
from: ctx.accounts.vault_a.to_account_info(),
to: ctx.accounts.user_ata_a.to_account_info(),
authority: ctx.accounts.pool.to_account_info(),
},
&[&pool.signer_seeds()],
),
amount_a,
)?;
token::transfer(
CpiContext::new_with_signer(
ctx.accounts.token_program.to_account_info(),
Transfer {
from: ctx.accounts.vault_b.to_account_info(),
to: ctx.accounts.user_ata_b.to_account_info(),
authority: ctx.accounts.pool.to_account_info(),
},
&[&pool.signer_seeds()],
),
amount_b,
)?;


Ok(())
}

pub fn swap(
pub lp_mint: Account<'info, Mint>,


/// Vaults
#[account(mut)]
pub from_vault: Account<'info, TokenAccount>,
#[account(mut)]
pub to_vault: Account<'info, TokenAccount>,


/// User ATAs
#[account(mut)]
pub user_from_ata: Account<'info, TokenAccount>,
#[account(mut)]
pub user_to_ata: Account<'info, TokenAccount>,


/// LP recycler vault
#[account(mut, address = pool.recycle_lp_vault)]
pub recycle_lp_vault: Account<'info, TokenAccount>,


pub token_program: Program<'info, Token>,
}


// ──────────────────────────────────────────────────────────────────────────────
// State + helpers
// ──────────────────────────────────────────────────────────────────────────────


#[account]
pub struct Pool {
pub authority: Pubkey,
pub token_a_mint: Pubkey,
pub token_b_mint: Pubkey,
pub vault_a: Pubkey,
pub vault_b: Pubkey,
pub lp_mint: Pubkey,
pub recycle_lp_vault: Pubkey,
pub fee_bps: u16,
pub bump: u8,
}


impl Pool {
pub const SIZE: usize = 32 + 32 + 32 + 32 + 32 + 32 + 32 + 2 + 1;
pub fn signer_seeds(&self) -> [&[u8]; 4] {
[
b"pool",
self.token_a_mint.as_ref(),
self.token_b_mint.as_ref(),
&[self.bump],
]
}
}


#[error_code]
pub enum AmmError {
#[msg("Slippage or price moved")] Slippage,
#[msg("Invalid basis points")] InvalidBps,
#[msg("Math error")] Math,
}


fn integer_sqrt(v: u128) -> u128 {
// simple integer sqrt for liquidity bootstrapping
let mut x0 = v;
let mut x1 = (x0 + 1) / 2;
while x1 < x0 {
x0 = x1;
x1 = (x1 + v / x1) / 2;
}
x0
}


fn get_amount_out(amount_in: u64, reserve_in: u64, reserve_out: u64) -> Result<u64> {
require!(reserve_in > 0 && reserve_out > 0, AmmError::Math);
// x*y = k, out = (amount_in * reserve_out) / (reserve_in + amount_in)
let num = u128::from(amount_in) * u128::from(reserve_out);
let den = u128::from(reserve_in) + u128::from(amount_in);
Ok((num / den) as u64)
}
