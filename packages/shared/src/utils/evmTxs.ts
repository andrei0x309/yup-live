
// Add later

// const prepareForTransaction = async ({
//     userProvider,
//     w3Modal,
//     ethersLib,
//     stackAlertWarning,
//     web3Mprom,
//     ethers
// }) => {
//     if (!userProvider) {
//         try {
//             await web3Mprom
//             const inst = await w3Modal.connect()
//             ethersLib = await ethers
//             userProvider = new ethersLib.providers.Web3Provider(inst)
//         } catch {
//             stackAlertWarning('User rejected connection')
//             return false
//         }
//     }
//     const { chainId } = await userProvider.getNetwork()
//     if (chainId !== 137) {
//         stackAlertWarning(`You are on wrong network(${chainId}), please switch to polygon(137)`)
//         return false
//     }
//     return true
// }