const { network, ethers } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
require("dotenv").config()

const FUND_AMOUNT = "1000000000000000000000"

const tokenURI = ["", "", ""]

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
        subscriptionId = transactionReciept.events[0].args.subId

        log(transactionReciept)

        subsciptionId = await transactionReciept.events[0].args.subId

        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
    } else {
        vrfCoordinatorAddress = networkConfig[chainId][vrfCoordinatorV2]
        subsciptionId = networkConfig[chainId][subsciptionId]
    }

    log("__________________________________________________________________________")

    let gaslane = networkConfig[chainId]["gasLane"]
    let mintfee = networkConfig[chainId]["mintFee"]
    let callbackGaslimit = networkConfig[chainId]["callbackGasLimit"]

    const args = [
        vrfCoordinatorAddress,
        subsciptionId,
        gaslane,
        mintfee,
        callbackGaslimit,
        tokenURI,
    ]

    const ipfsNft = await deploy("ipfsNFT", {
        from: deployer,
        log: true,
        args: args,
    })

    if (chainId == 31337) {
        await vrfCoordinatorV2Mock.addConsumer(subscriptionId, ipfsNft.address)
    }

    if (chainId != 31337) {
        await verify(ipfsNft.address, args)
    }
}
