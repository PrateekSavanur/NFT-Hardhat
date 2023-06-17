const { network, ethers } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

const FUND_AMOUNT = "1000000000000000000000"

const tokenURI = []

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let vrfCoordinatorV2Mock, vrfCoordinatorAddress, subsciptionId

    if (chainId == 31337) {
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorAddress = vrfCoordinatorV2Mock.address
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        const transactionReciept = await transactionResponse.wait(1)

        log(transactionReciept)

        subsciptionId = await transactionReciept.events[0].args.subId

        await vrfCoordinatorV2Mock.fundSubsciption(subsciptionId, FUND_AMOUNT)
    } else {
        vrfCoordinatorAddress = networkConfig[chainId][vrfCoordinatorV2]
        subsciptionId = networkConfig[chainId][subsciptionId]
    }

    log("__________________________________________________________________________")

    const args = [
        vrfCoordinatorAddress,
        subsciptionId,
        networkConfig[chainId][gasLane],
        networkConfig[chainId][mintFee],
        networkConfig[chainId][callbackGasLimit],
        tokenURI,
    ]

    const ipfsNft = await deploy("ipfsNFT", {
        from: deployer,
        log: true,
        args: args,
    })

    if (chainId == 31337) {
        await vrfCoordinatorV2Mock.addConsumer(subscriptionId, randomIpfsNft.address)
    }

    if (chainId != 31337) {
        await verify(ipfsNft.address, args)
    }
}
