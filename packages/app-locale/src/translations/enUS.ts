import { localeKeys } from "../localeKeys";
const enUs = {
  [localeKeys.welcomeToReact]: "Welcome To React 👏",
  [localeKeys.messagesCounter]: `Hello {{user}}, <i><strong style="color: yellow;">you've</strong></i> got {{counter}} messages.`,
  [localeKeys.menu]: "menu",
  [localeKeys.goHome]: "go home",
  [localeKeys.pageNotFound]: "page not found",
  [localeKeys.confirm]: "confirm",
  [localeKeys.darwiniaNetwork]: "darwinia network",
  [localeKeys.connectWallet]: "connect wallet",
  [localeKeys.connectToMetamask]: "connect to metaMask",
  [localeKeys.connectWalletInfo]: "Connect wallet to participate in Staking and Deposit in Darwinia.",
  [localeKeys.latestStakingRewards]: "latest staking rewards",
  [localeKeys.reservedInStaking]: "reserved in staking",
  [localeKeys.bonded]: "bonded",
  [localeKeys.inDeposit]: "in deposit",
  [localeKeys.seeDetailed]: `See detailed staking rewards in `,
  [localeKeys.noRewards]: "no rewards yet",
  [localeKeys.staking]: "staking",
  [localeKeys.deposit]: "deposit",
  [localeKeys.delegate]: "delegate",
  [localeKeys.selectCollator]: "select collator",
  [localeKeys.stakingBasicInfo]: `Note that it takes 1 session(～{{sessionTime}}) to get rewards if your collator get elected. The delegation locks your tokens, and You need to unbond in order for your staked tokens to be transferrable again, which takes ～{{unbondTime}}.`,
  [localeKeys.balance]: "balance",
  [localeKeys.useDepositToStake]: "Use A Deposit To Stake",
  [localeKeys.stake]: "stake",
};

export default enUs;
