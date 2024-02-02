// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFV2WrapperConsumerBase.sol";

contract CheapVRFv2DirectFundingConsumer is
    VRFV2WrapperConsumerBase,
    ConfirmedOwner
{
    event Test(string test);
    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);

    uint32 constant callbackGasLimit = 100_000;
    uint16 constant requestConfirmations = 3;
    uint32 constant numWords = 1;

    // Link token address
    address immutable setLinkAddress;

    uint64 linkFee = 1_000_000_000_000_000;

    constructor(
        address linkAddress,
        address wrapperAddress
    )
        ConfirmedOwner(msg.sender)
        VRFV2WrapperConsumerBase(linkAddress, wrapperAddress)
    {
        setLinkAddress = linkAddress;
    }

    function requestRandomWords()
        external
        onlyOwner
        returns (uint256 requestId)
    {
        requestId = requestRandomness(
            callbackGasLimit,
            requestConfirmations,
            numWords
        );
        emit RequestSent(requestId, numWords);
        return requestId;
    }

    function setLinkFee(uint64 newLinkFee) external {
        linkFee = newLinkFee;
    }

    function onTokenTransfer(
        address sender,
        uint256 fee,
        bytes calldata _data
    ) public {
        require(msg.sender == setLinkAddress, "Use link");
        require(fee >= linkFee, "Not enough link passed");
        requestRandomness(callbackGasLimit, requestConfirmations, numWords);
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        emit RequestFulfilled(_requestId, _randomWords);
    }

    function withdrawLink() public {
        LinkTokenInterface link = LinkTokenInterface(setLinkAddress);
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }
}
