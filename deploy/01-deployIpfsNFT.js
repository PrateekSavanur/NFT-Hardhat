const { network, ethers } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")
const { storeImages, storeTokenUriMetadata } = require("../utils/uploadToPinata")
const { verify } = require("../utils/verify")
require("dotenv").config()

const FUND_AMOUNT = "1000000000000000000000"
const imagesLocation = "./images/"
const tokenURI = [
    "ipfs://QmNgKrxYwbFyfPAHjNyjF56idtYBvQ4x59hz9nhKgNTjbQ",
    "ipfs://QmTy6yF38xsm1VcKwSiGHnb4s9sDzGk8vwG3X882tX4z6W",
    "ipfs://QmY2LjRYzjDze3f5oXqkEufiKc1tduNmtbPwF9KHmjJb1U",
]

const metadataTemplate = {
    name: "",
    description: "",
    image: "",
    attributes: [
        {
            trait_type: "Cuteness",
            value: 100,
        },
    ],
}

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let vrfCoordinatorV2Mock, vrfCoordinatorAddress, subsciptionId

    if (process.env.UPLOAD_TO_PINATA == "true") {
        tokenUris = await handleTokenUris()
    }

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

async function handleTokenUris() {
    tokenUris = []
    const { responses: imageUploadResponses, files } = await storeImages(imagesLocation)
    for (imageUploadResponseIndex in imageUploadResponses) {
        let tokenUriMetadata = { ...metadataTemplate }
        tokenUriMetadata.name = files[imageUploadResponseIndex].replace(".png", "")
        tokenUriMetadata.description = `The greatest ever ${tokenUriMetadata.name} !`
        tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`
        console.log(`Uploading ${tokenUriMetadata.name}...`)
        const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetadata)
        tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
    }
    console.log("Token URIs uploaded! They are:")
    console.log(tokenUris)
    return tokenUris
}

module.exports.tags = ["all", "randomipfs", "main"]
