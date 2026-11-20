const CONTRACT_ADDRESS = '0xb918b6ad21211B075a0761b87b09561D2A5e5a1f';

function copyContract() {
  const label = document.getElementById('copyLabel');
  navigator.clipboard.writeText(CONTRACT_ADDRESS).then(() => {
    if (label) {
      label.textContent = 'Copied';
      setTimeout(() => { label.textContent = 'Copy'; }, 1800);
    }
  });
}

async function addZeroToMetaMask() {
  if (!window.ethereum) {
    alert('MetaMask not detected. Please install MetaMask to add ZERO.');
    return;
  }
  try {
    await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: CONTRACT_ADDRESS,
          symbol: 'ZERO',
          decimals: 18,
          image: 'https://zerocoin.tech/assets/images/logo.svg'
        }
      }
    });
  } catch (err) {
    console.error('MetaMask wallet_watchAsset failed:', err);
  }
}

document.getElementById('addTokenBtn')?.addEventListener('click', addZeroToMetaMask);
document.getElementById('headerAddTokenBtn')?.addEventListener('click', addZeroToMetaMask);

const menuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');
if (menuBtn && mobileNav) {
  menuBtn.addEventListener('click', () => {
    const isOpen = !mobileNav.hidden;
    mobileNav.hidden = isOpen;
    menuBtn.setAttribute('aria-expanded', String(!isOpen));
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileNav.hidden = true;
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}
