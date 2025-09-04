// Deployment script for Midnight Network
const { MidnightJS } = require('@midnight-ntwrk/midnight-js-sdk');

async function deployContracts() {
    console.log('🚀 Deploying AnonShare contracts to Midnight Network...');
    
    try {
        // Initialize Midnight connection
        const midnight = new MidnightJS({
            network: 'testnet',
            rpcUrl: process.env.MIDNIGHT_RPC_URL || 'https://testnet-rpc.midnight.network'
        });
        
        await midnight.connect();
        console.log('✅ Connected to Midnight Network');
        
        // Deploy VerificationRegistry contract
        const contractCode = require('../contracts/VerificationRegistry.sol');
        const deployResult = await midnight.deployContract({
            code: contractCode,
            constructorArgs: []
        });
        
        console.log('✅ VerificationRegistry deployed at:', deployResult.contractAddress);
        
        // Deploy ZK circuit
        const circuitCode = require('../circuits/identity-verification.compact');
        const circuitResult = await midnight.deployCircuit({
            circuit: circuitCode,
            name: 'IdentityVerification'
        });
        
        console.log('✅ Identity verification circuit deployed:', circuitResult.circuitId);
        
        // Save deployment info
        const deploymentInfo = {
            contractAddress: deployResult.contractAddress,
            circuitId: circuitResult.circuitId,
            network: 'testnet',
            deployedAt: new Date().toISOString()
        };
        
        require('fs').writeFileSync(
            '../deployment.json', 
            JSON.stringify(deploymentInfo, null, 2)
        );
        
        console.log('🎉 Deployment complete! Info saved to deployment.json');
        
    } catch (error) {
        console.error('❌ Deployment failed:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    deployContracts();
}

module.exports = { deployContracts };
