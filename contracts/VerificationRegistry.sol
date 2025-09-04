// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

/**
 * @title VerificationRegistry
 * @dev Smart contract for managing anonymous identity verifications on Midnight
 */
contract VerificationRegistry {
    
    struct Verification {
        bytes32 proofHash;
        uint8 organizationType; // 1=Academic, 2=Corporate, 3=Government
        uint8 roleType;         // 1=Student, 2=Employee, 3=Official
        uint256 timestamp;
        bool isActive;
    }
    
    mapping(address => Verification) public verifications;
    mapping(bytes32 => bool) public usedProofs;
    
    event VerificationSubmitted(
        address indexed user,
        uint8 organizationType,
        uint8 roleType,
        uint256 timestamp
    );
    
    event VerificationRevoked(address indexed user);
    
    /**
     * @dev Submit a zero-knowledge proof for identity verification
     * @param _proofHash Hash of the ZK proof
     * @param _organizationType Type of organization (1-3)
     * @param _roleType Type of role (1-3)
     */
    function submitVerification(
        bytes32 _proofHash,
        uint8 _organizationType,
        uint8 _roleType
    ) external {
        require(_organizationType >= 1 && _organizationType <= 3, "Invalid organization type");
        require(_roleType >= 1 && _roleType <= 3, "Invalid role type");
        require(!usedProofs[_proofHash], "Proof already used");
        
        // Store verification
        verifications[msg.sender] = Verification({
            proofHash: _proofHash,
            organizationType: _organizationType,
            roleType: _roleType,
            timestamp: block.timestamp,
            isActive: true
        });
        
        usedProofs[_proofHash] = true;
        
        emit VerificationSubmitted(msg.sender, _organizationType, _roleType, block.timestamp);
    }
    
    /**
     * @dev Check if an address has valid verification
     * @param _user Address to check
     * @return isVerified, organizationType, roleType
     */
    function getVerification(address _user) 
        external 
        view 
        returns (bool isVerified, uint8 organizationType, uint8 roleType) 
    {
        Verification memory verification = verifications[_user];
        return (verification.isActive, verification.organizationType, verification.roleType);
    }
    
    /**
     * @dev Revoke verification (user can revoke their own)
     */
    function revokeVerification() external {
        require(verifications[msg.sender].isActive, "No active verification");
        
        verifications[msg.sender].isActive = false;
        emit VerificationRevoked(msg.sender);
    }
}
