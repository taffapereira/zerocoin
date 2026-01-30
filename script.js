// Copy Contract Address
function copyContract() {
    const address = document.getElementById("contractAddress").innerText;
    navigator.clipboard.writeText(address).then(() => {
        alert("Contract address copied!");
    });
}

// Add to MetaMask
document.getElementById("addTokenBtn").addEventListener("click", async () => {
    if (window.ethereum) {
        try {
            await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: '0xb918b6ad21211B075a0761b87b09561D2A5e5a1f',
                        symbol: 'ZERO',
                        decimals: 18,
                        image: 'https://taffapereira.github.io/zerocoin/assets/images/logo.png', // Fallback URL
                    },
                },
            });
        } catch (error) {
            console.error(error);
        }
    } else {
        alert("Please install MetaMask!");
    }
});

// Glitch Effect (Optional, pure CSS handles most)
console.log("Zero Coin Landing Loaded. Ready for Moon.");