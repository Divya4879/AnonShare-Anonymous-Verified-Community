// Zero-Knowledge Proof utilities for AnonShare
const { MidnightJS } = require('@midnight-ntwrk/midnight-js-sdk');

class ZKProofGenerator {
    constructor() {
        this.midnight = null;
        this.circuitId = null;
    }
    
    async initialize() {
        try {
            this.midnight = new MidnightJS({
                network: 'testnet',
                rpcUrl: process.env.MIDNIGHT_RPC_URL || 'https://testnet-rpc.midnight.network'
            });
            
            await this.midnight.connect();
            
            // Load circuit ID from deployment
            const deployment = require('../deployment.json');
            this.circuitId = deployment.circuitId;
            
            console.log('✅ ZK Proof Generator initialized');
        } catch (error) {
            console.error('❌ Failed to initialize ZK Proof Generator:', error);
            throw error;
        }
    }
    
    /**
     * Generate ZK proof for identity verification
     * @param {Object} credentials - User credentials
     * @param {string} credentials.name - User's name
     * @param {string} credentials.organization - Organization name
     * @param {string} credentials.role - User's role
     * @param {string} credentials.idNumber - ID number
     * @returns {Object} ZK proof and public outputs
     */
    async generateIdentityProof(credentials) {
        if (!this.midnight || !this.circuitId) {
            throw new Error('ZK Proof Generator not initialized');
        }
        
        try {
            // Hash the credentials for verification
            const verificationHash = this.hashCredentials(credentials);
            
            // Determine organization and role types
            const organizationType = this.getOrganizationType(credentials.organization);
            const roleType = this.getRoleType(credentials.role);
            
            // Private inputs (not revealed in proof)
            const privateInputs = {
                name: this.stringToField(credentials.name),
                organization: this.stringToField(credentials.organization),
                role: this.stringToField(credentials.role),
                idNumber: this.stringToField(credentials.idNumber)
            };
            
            // Public inputs (revealed in proof)
            const publicInputs = {
                organizationType: organizationType,
                roleType: roleType,
                verificationHash: verificationHash
            };
            
            // Generate the proof
            const proof = await this.midnight.generateProof({
                circuitId: this.circuitId,
                privateInputs: privateInputs,
                publicInputs: publicInputs
            });
            
            return {
                proof: proof.proof,
                publicSignals: proof.publicSignals,
                organizationType: organizationType,
                roleType: roleType,
                verificationHash: verificationHash
            };
            
        } catch (error) {
            console.error('❌ Failed to generate ZK proof:', error);
            throw error;
        }
    }
    
    /**
     * Verify a ZK proof
     * @param {Object} proofData - Proof data to verify
     * @returns {boolean} True if proof is valid
     */
    async verifyProof(proofData) {
        try {
            const isValid = await this.midnight.verifyProof({
                circuitId: this.circuitId,
                proof: proofData.proof,
                publicSignals: proofData.publicSignals
            });
            
            return isValid;
        } catch (error) {
            console.error('❌ Failed to verify ZK proof:', error);
            return false;
        }
    }
    
    // Helper methods
    hashCredentials(credentials) {
        const crypto = require('crypto');
        const data = `${credentials.name}${credentials.organization}${credentials.role}${credentials.idNumber}`;
        return crypto.createHash('sha256').update(data).digest('hex');
    }
    
    getOrganizationType(organization) {
        const org = organization.toLowerCase();
        if (org.includes('university') || org.includes('college') || org.includes('school')) {
            return 1; // Academic
        } else if (org.includes('government') || org.includes('ministry') || org.includes('department')) {
            return 3; // Government
        } else {
            return 2; // Corporate
        }
    }
    
    getRoleType(role) {
        const r = role.toLowerCase();
        if (r.includes('student') || r.includes('pupil')) {
            return 1; // Student
        } else if (r.includes('official') || r.includes('officer') || r.includes('minister')) {
            return 3; // Official
        } else {
            return 2; // Employee
        }
    }
    
    stringToField(str) {
        // Convert string to field element (simplified)
        const crypto = require('crypto');
        const hash = crypto.createHash('sha256').update(str).digest('hex');
        return BigInt('0x' + hash.substring(0, 16)); // Use first 64 bits
    }
}

module.exports = { ZKProofGenerator };
