// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

/**
 * @title VerificationRegistry
 * @dev Smart contract for managing anonymous identity verifications on Midnight
 * Stores ZK proof hashes without revealing personal information
 */
contract VerificationRegistry {
    
    struct Verification {
        bytes32 proofHash;          // Hash of the ZK proof
        string organization;        // Public for feedback (e.g., "Harvard University")
        string role;               // Public role (e.g., "Student")
        uint8 organizationType;    // 1=Academic, 2=Corporate, 3=Government
        uint8 roleType;           // 1=Student, 2=Employee, 3=Official
        uint256 timestamp;
        uint256 verificationScore; // 1-10 quality score
        bool isActive;
        address verifier;          // Who submitted the proof
    }
    
    // Mapping from proof hash to verification data
    mapping(bytes32 => Verification) public verifications;
    
    // Mapping from address to their latest proof hash
    mapping(address => bytes32) public userLatestProof;
    
    // Mapping to prevent proof reuse
    mapping(bytes32 => bool) public usedProofs;
    
    // Anonymous reputation system
    mapping(bytes32 => uint256) public anonymousReputation;
    
    // Events
    event VerificationSubmitted(
        bytes32 indexed proofHash,
        address indexed verifier,
        string organization,
        uint8 organizationType,
        uint8 roleType,
        uint256 verificationScore,
        uint256 timestamp
    );
    
    event VerificationRevoked(bytes32 indexed proofHash, address indexed verifier);
    
    event ReputationUpdated(bytes32 indexed anonymousId, uint256 newScore);
    
    /**
     * @dev Submit a zero-knowledge proof for identity verification
     * @param _proofHash Hash of the ZK proof (prevents double-spending)
     * @param _organization Organization name (visible for feedback)
     * @param _role User role (visible for context)
     * @param _organizationType Type of organization (1-3)
     * @param _roleType Type of role (1-3)
     * @param _verificationScore Quality score (1-10)
     */
    function submitVerification(
        bytes32 _proofHash,
        string memory _organization,
        string memory _role,
        uint8 _organizationType,
        uint8 _roleType,
        uint256 _verificationScore
    ) external {
        require(_organizationType >= 1 && _organizationType <= 3, "Invalid organization type");
        require(_roleType >= 1 && _roleType <= 3, "Invalid role type");
        require(_verificationScore >= 1 && _verificationScore <= 10, "Invalid verification score");
        require(!usedProofs[_proofHash], "Proof already used");
        require(bytes(_organization).length > 0, "Organization cannot be empty");
        require(bytes(_role).length > 0, "Role cannot be empty");
        
        // Store verification
        verifications[_proofHash] = Verification({
            proofHash: _proofHash,
            organization: _organization,
            role: _role,
            organizationType: _organizationType,
            roleType: _roleType,
            timestamp: block.timestamp,
            verificationScore: _verificationScore,
            isActive: true,
            verifier: msg.sender
        });
        
        // Mark proof as used
        usedProofs[_proofHash] = true;
        
        // Update user's latest proof
        userLatestProof[msg.sender] = _proofHash;
        
        emit VerificationSubmitted(
            _proofHash,
            msg.sender,
            _organization,
            _organizationType,
            _roleType,
            _verificationScore,
            block.timestamp
        );
    }
    
    /**
     * @dev Get verification details by proof hash
     * @param _proofHash The proof hash to query
     * @return verification data
     */
    function getVerification(bytes32 _proofHash) 
        external 
        view 
        returns (
            bool isActive,
            string memory organization,
            string memory role,
            uint8 organizationType,
            uint8 roleType,
            uint256 verificationScore,
            uint256 timestamp
        ) 
    {
        Verification memory verification = verifications[_proofHash];
        return (
            verification.isActive,
            verification.organization,
            verification.role,
            verification.organizationType,
            verification.roleType,
            verification.verificationScore,
            verification.timestamp
        );
    }
    
    /**
     * @dev Check if an address has valid verification
     * @param _user Address to check
     * @return isVerified, organization, organizationType, roleType
     */
    function getUserVerification(address _user) 
        external 
        view 
        returns (
            bool isVerified, 
            string memory organization,
            uint8 organizationType, 
            uint8 roleType,
            uint256 verificationScore
        ) 
    {
        bytes32 proofHash = userLatestProof[_user];
        if (proofHash == bytes32(0)) {
            return (false, "", 0, 0, 0);
        }
        
        Verification memory verification = verifications[proofHash];
        return (
            verification.isActive,
            verification.organization,
            verification.organizationType,
            verification.roleType,
            verification.verificationScore
        );
    }
    
    /**
     * @dev Update anonymous reputation (privacy-preserving)
     * @param _anonymousId Anonymous identifier derived from proof
     * @param _newScore New reputation score
     */
    function updateAnonymousReputation(bytes32 _anonymousId, uint256 _newScore) external {
        require(_newScore <= 10, "Score cannot exceed 10");
        
        // Only allow updates from verified users
        bytes32 userProofHash = userLatestProof[msg.sender];
        require(userProofHash != bytes32(0), "User not verified");
        require(verifications[userProofHash].isActive, "Verification not active");
        
        anonymousReputation[_anonymousId] = _newScore;
        emit ReputationUpdated(_anonymousId, _newScore);
    }
    
    /**
     * @dev Get anonymous reputation score
     * @param _anonymousId Anonymous identifier
     * @return reputation score
     */
    function getAnonymousReputation(bytes32 _anonymousId) external view returns (uint256) {
        return anonymousReputation[_anonymousId];
    }
    
    /**
     * @dev Revoke verification (user can revoke their own)
     */
    function revokeVerification() external {
        bytes32 proofHash = userLatestProof[msg.sender];
        require(proofHash != bytes32(0), "No verification found");
        require(verifications[proofHash].isActive, "Verification already inactive");
        
        verifications[proofHash].isActive = false;
        emit VerificationRevoked(proofHash, msg.sender);
    }
    
    /**
     * @dev Get total number of verifications by organization type
     * @param _organizationType Organization type to count
     * @return count of verifications
     */
    function getVerificationCountByType(uint8 _organizationType) external view returns (uint256) {
        // This would require additional storage in a real implementation
        // For demo purposes, return a mock count
        return 42 + _organizationType * 10;
    }
    
    /**
     * @dev Check if a proof hash exists and is valid
     * @param _proofHash Proof hash to verify
     * @return exists and is active
     */
    function isValidProof(bytes32 _proofHash) external view returns (bool) {
        return verifications[_proofHash].isActive;
    }
}
