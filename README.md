# VerifiedVoices

[![Build Status](https://img.shields.io/badge/live-demo-brightgreen)](https://anonshare-verified-community.netlify.app)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Midnight Network](https://img.shields.io/badge/blockchain-Midnight%20Network-purple)](https://midnight.network)

Anonymous identity verification platform using zero-knowledge proofs for privacy-preserving community participation.

You can check it out here:- [VerifiedVoices](https://anonshare-verified-community.netlify.app)

Or, you can see it in action here- [Project Video Demo](https://youtu.be/ekou4nwSGlM)

<img width="1898" height="952" alt="Screenshot 2025-09-05 130123" src="https://github.com/user-attachments/assets/f2604ca8-5202-437c-83b5-14694aa1707f" />
<img width="1201" height="938" alt="Screenshot 2025-09-05 163246" src="https://github.com/user-attachments/assets/6a05b670-9ad0-4cec-9eea-a31a592a8f23" />
<img width="1230" height="951" alt="Screenshot 2025-09-05 163327" src="https://github.com/user-attachments/assets/2b6b70bf-0b4e-4a52-af59-e57395221632" />


---

## Overview

VerifiedVoices enables users to prove organizational credentials (university, company, government) without revealing personal information. Built on Midnight Network's zero-knowledge infrastructure with client-side cryptographic processing.

**Key Features:**
- Zero-knowledge identity verification using Compact circuits
- Anonymous community participation with verified credentials
- Client-side document processing with OCR analysis
- Time-based rate limiting via cryptographic nullifiers
- WCAG 2.1 AA accessibility compliance

---

## Architecture

```
Document Upload → OCR Analysis → ZK Proof Generation → Anonymous Verification
     ↓               ↓              ↓                    ↓
  Browser Only   Extract Metadata   Compact Circuit    Verified Session
```

### Components

- **Frontend**: Vanilla JavaScript, Tailwind CSS
- **ZK Circuits**: Midnight Network Compact language
- **Document Analysis**: Groq API for OCR processing
- **Data Storage**: Firebase for anonymous community data
- **Deployment**: Netlify with environment injection

---

## Installation

### Prerequisites

- Node.js 16+
- Modern browser with WebCrypto API support

### Setup

```bash
git clone https://github.com/Divya4879/AnonShare-Anonymous-Verified-Community.git
cd AnonShare-Anonymous-Verified-Community
npm install
npm run dev
```

The application will be available at `http://localhost:8000`.

### Environment Configuration

```bash
cp .env.example .env
```

Optional API keys for enhanced functionality:

```env
GROQ_API_KEY=your_groq_api_key
FIREBASE_API_KEY=your_firebase_key
```
---

## Usage

### Basic Verification Flow

1. **Upload Document**: Drag and drop official ID (student card, employee badge, government ID)
2. **Processing**: Client-side OCR extracts organizational metadata
3. **ZK Proof**: Generate cryptographic proof without revealing personal data
4. **Community Access**: 60-minute anonymous session with verified status

### API Reference

#### Core Functions

```javascript
// Generate ZK proof from document data
await midnight.generateZKProof(verificationData)

// Create anonymous session
const session = await createAnonymousSession(proof)

// Submit anonymous post
await submitPost(content, verificationProof)
```

#### Circuit Interface

```compact
circuit IdentityVerification {
    private field name, organization, idNumber;
    public field organizationType, roleType, nullifier;
    
    constraint {
        nullifier == hash(userSecret, timeEpoch);
        organizationType ∈ {1, 2, 3}; // Academic, Corporate, Government
    }
}
```

---

## Privacy Model

### Data Processing
- **Client-side only**: Personal data never transmitted to servers
- **Cryptographic hashing**: SHA-256 commitments for privacy guarantees
- **Selective disclosure**: Prove organizational type without revealing specifics

### Storage
- **On-chain**: Anonymous ZK proofs, organization types, timestamps
- **Never stored**: Names, addresses, document numbers, personal identifiers

### Rate Limiting
- Time-based nullifiers prevent spam (5 verifications/hour)
- Cryptographically unlinkable across sessions
- Automatic session expiry after 60 minutes

---

## Development

### Project Structure

```
├── circuits/
│   └── identity-verification.compact    # ZK circuit definition
├── contracts/
│   └── VerificationRegistry.sol         # Smart contract interface
├── lib/
│   └── zk-proofs.js                     # ZK proof utilities
├── scripts/
│   └── deploy.js                        # Deployment script
├── node_modules/                        # Dependencies
├── .git/                                # Git repository
├── .netlify/                            # Netlify deployment
├── config.js                            # Configuration
├── env-inject.js                        # Environment injection
├── firebase-config.js                   # Anonymous data storage
├── groq-ai.js                          # Document analysis
├── midnight-integration.js              # Blockchain integration
├── index.html                           # Landing page
├── verify.html                          # Verification interface
├── posts.html                           # Community platform
├── favicon.ico                          # Site icon
├── build.sh                             # Build script
├── netlify.toml                         # Netlify config
├── package.json                         # Project dependencies
├── package-lock.json                    # Dependency lock
├── .gitignore                           # Git ignore rules
├── .env                                 # Environment variables
└── .env.example                         # Environment template
```

### Testing

```bash
# Run local development server
npm run dev

# Test ZK proof generation
node scripts/test-circuits.js

# Validate accessibility compliance
npm run test:a11y
```

### Building

```bash
# Build for production
npm run build

# Deploy to Netlify
netlify login
netlify init
npm run deploy
```

---

## Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes and test locally
4. Submit a pull request

### Code Style

- Follow existing JavaScript patterns
- Maintain WCAG 2.1 AA compliance
- Add tests for new ZK circuit functionality
- Update documentation for API changes

### Areas for Contribution

- Additional document type support
- Mobile application development
- Advanced reputation algorithms
- Multi-language internationalization
- Better identity verification systems

---

## Security

### Vulnerability Reporting

Report security vulnerabilities to [Divya](https://x.com/TechDsa).

### Security Features

- Client-side cryptographic processing
- Zero-knowledge proof verification
- Rate limiting via nullifiers
- Automatic session expiry

---

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.

---

## Acknowledgments

- [Midnight Network](https://midnight.network) for zero-knowledge infrastructure
- [Groq](https://groq.com) for AI-powered document analysis
- [Firebase](https://firebase.google.com) for anonymous data storage

**Maintainer**: [@Divya4879](https://github.com/Divya4879) 
