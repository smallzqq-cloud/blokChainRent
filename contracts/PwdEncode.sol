// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract PwdEncode {

    using ECDSA for bytes32;
    bytes32 public PwdMsgData =keccak256("PwdMsg(uint256 itemId, uint256,maddress landlord, address tenant)");
    bytes32 public immutable DOMAIN_SEPARATOR;
    constructor() {
        uint256 chainId;
        assembly {
            chainId := chainid()
        }

        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes("PawnMultiSig")),
                keccak256(bytes("1")),
                chainId,
                address(this)
            )
        );
    }



    function pwdCallDigest( uint256 itemId, address landlord, address tenant) private view returns (bytes32 digest) {
        bytes32 hashStruct = keccak256(
            abi.encode(
                PwdMsgData,
                itemId,
                landlord,
                tenant
            )
        );

        digest = keccak256(
            abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, hashStruct)
        );
    }


    function pwdCheck(uint256 itemId, address landlord, address tenant, bytes memory sig) internal view returns(address) {
            bytes32 digest = pwdCallDigest(itemId, landlord, tenant);
            address signer = digest.recover(sig);
            return   signer;
        }

}