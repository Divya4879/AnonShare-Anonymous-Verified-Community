# 🌙 Midnight Network ID Verification Platform

A privacy-first identity verification DApp built with Midnight Network's zero-knowledge proofs for the **Midnight Network "Privacy First" Challenge**.

## 🎯 Challenge Submission

**Challenge:** Midnight Network "Privacy First" Challenge - Protect That Data  
**Category:** $3,500 USD Prize + DEV++ Membership  
**Submission Deadline:** September 07, 2025 23:59 PT

## ✨ Features

### 🔒 Privacy-First Verification
- **Zero-Knowledge Proofs**: Uses Midnight's Compact language for ZK circuits
- **Anonymous Identity**: Proves identity without revealing personal information
- **Client-Side Processing**: All sensitive data stays in your browser
- **Blockchain Verification**: Proofs stored on Midnight Network testnet

### 🤖 AI-Powered Analysis
- **OCR Text Extraction**: Real text extraction using Tesseract.js
- **Computer Vision**: Photo region detection with OpenCV.js
- **QR/Barcode Detection**: Machine-readable code scanning with jsQR
- **Smart Scoring**: 10-point verification system

### 🌐 Decentralized Community
- **Anonymous Posts**: Share thoughts without revealing identity
- **Verified Badges**: Show organization type and role without specifics
- **Global Storage**: Posts stored on Midnight Network blockchain
- **Real-time Updates**: Live community feed

## 🛠️ Technology Stack

- **Blockchain**: Midnight Network (Testnet)
- **ZK Circuits**: Compact language
- **Smart Contracts**: IdentityVerifier.compact
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **AI/ML**: Tesseract.js, OpenCV.js, jsQR
- **Storage**: Midnight Network + Firebase (fallback)

## 🚀 Quick Start

### Prerequisites
- **Google Chrome**: Required for Lace wallet
- **Modern web browser**: With JavaScript enabled
- **Internet connection**: For testnet access

### Installation

#### 1. Clone and Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd id-verification-platform

# Make setup script executable
chmod +x setup-midnight.sh

# Run automated Midnight setup
./setup-midnight.sh
```

#### 2. Manual Setup (if automated fails)
```bash

# Pull Midnight proof server

# Start proof server

# Verify it's running
```

#### 3. Install Lace Wallet
1. Open Google Chrome
2. Visit [Lace Wallet](https://www.lace.io/)
3. Install the extension
4. Create new wallet (save seed phrase securely!)
5. Get testnet tokens from [Midnight Faucet](https://faucet.midnight.network/)

#### 4. Start Development Server
```bash
# Start local server
npm run dev
# or
python3 -m http.server 8000
```

### Usage
1. **Visit the Platform**: Open `http://localhost:8000`
2. **Check Midnight Status**: Green dot = ready, Yellow = connecting, Red = mock mode
3. **Upload ID Card**: Drag & drop or select your ID image
4. **ZK Verification**: Watch real-time processing and proof generation
5. **Join Community**: Post anonymously with verified status
6. **Privacy Guaranteed**: Your personal data never leaves your browser

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Start Midnight proof server
npm run proof-server

# Build for production
npm run build

# Deploy to Netlify
./deploy.sh

# Test Midnight integration
# Open browser console and run: testMidnightIntegration()
```

## 🌙 Midnight Network Integration

### ZK Circuit (`circuits/verify-identity.compact`)
```compact
circuit VerifyIdentity {
    // Private inputs (never revealed)
    private field name_hash;
    private field org_hash;
    private field role_hash;
    private field id_number_hash;
    
    // Public outputs (revealed on-chain)
    public field verification_score;
    public field is_verified;
    public field anonymized_org_type;
    public field anonymized_role_type;
    public field timestamp;
    
    // Constraints ensure verification logic
    constraint verification_score >= 5 ==> is_verified == 1;
    constraint verification_score < 5 ==> is_verified == 0;
}
```

### Smart Contract (`contracts/IdentityVerifier.compact`)
- **verifyIdentity()**: Stores verification proofs on-chain
- **createPost()**: Manages anonymous posts
- **isVerified()**: Prevents duplicate ID usage
- **getPosts()**: Provides public verification queries

### Integration Features
- **Real ZK Proofs**: Generated using Compact circuits
- **Blockchain Storage**: Verifications stored on Midnight testnet
- **Wallet Integration**: Connects to Lace wallet
- **Privacy Preservation**: Personal data never transmitted
- **Mock Fallback**: Works without full setup for demos

## 🔒 Privacy Features

### What We Store On-Chain
- ✅ Anonymous verification proofs (ZK proofs)
- ✅ Organization type (University/Company/Government/Other)
- ✅ Role type (Student/Employee/Official/Other)
- ✅ Anonymous posts and timestamps
- ✅ Verification scores (public)

### What We DON'T Store
- ❌ Real names or personal information
- ❌ ID card images or sensitive data
- ❌ Specific organization names
- ❌ Specific job titles or roles
- ❌ Any personally identifiable information

### How Privacy is Maintained
1. **Client-Side Hashing**: Personal data hashed in browser
2. **Zero-Knowledge Proofs**: Only proof validity is public
3. **Anonymous Posting**: Posts linked to proof hash, not identity
4. **No Data Transmission**: Sensitive data never leaves your device

## 📱 Mobile Support

- Responsive design for all screen sizes
- Touch-friendly file upload
- Mobile camera integration
- Optimized OCR processing

## 🎨 UI/UX Features

- **Dark Theme**: Professional pink-red gradient design
- **Smooth Animations**: Real-time processing feedback
- **Accessibility**: High contrast, keyboard navigation
- **Modern Design**: Clean, minimalist interface
- **Status Indicators**: Real-time Midnight Network status

## 🧪 Testing

### Test with Real ID Cards
1. **Student ID**: Should detect university keywords, photo region
2. **Employee Badge**: Should detect company keywords, role information
3. **Government ID**: Should detect official keywords, department info

### Expected Results
- **High Quality ID** (clear text, photo, QR): 8-10 points → ✅ Verified
- **Medium Quality ID** (some text, photo): 5-7 points → ✅ Verified  
- **Poor Quality ID** (blurry, missing info): 0-4 points → ❌ Failed

### Test Midnight Integration
```javascript
// Open browser console and run:
testMidnightIntegration()
```

## 🚀 Deployment

### Netlify (Recommended)
```bash
# Deploy with script
./deploy.sh

# Or manual deployment
netlify deploy --prod --dir=.
```

### Other Platforms
- **Vercel**: `vercel --prod`
- **GitHub Pages**: Push to `gh-pages` branch
- **Firebase Hosting**: `firebase deploy`

## 🔧 Troubleshooting

### Midnight Network Issues
```bash
# Check proof server
curl http://localhost:6300/health

# Restart proof server

# View logs
```

### Lace Wallet Issues
- Ensure you're using Google Chrome
- Check wallet is connected to Midnight Testnet
- Verify you have tDUST tokens
- Try refreshing the page

### Common Solutions
- **Red status indicator**: Normal for demo mode
- **Yellow status indicator**: Proof server starting up
- **Green status indicator**: Full Midnight integration active

## 📄 License

Apache 2.0 License - Required for Midnight Network Challenge

## 🏆 Challenge Compliance

### Requirements Met ✅
- ✅ Uses Midnight's Compact language for ZK circuits
- ✅ Integrates MidnightJS for zero-knowledge proofs
- ✅ Includes smart contracts and user interface
- ✅ Focuses on identity attestation tools
- ✅ Uses only mocked transactions (no real value)
- ✅ Open-source under Apache 2.0 license
- ✅ Privacy-preserving mechanism as core feature

### Judging Criteria
- **Technology Use**: Real Midnight Network integration with ZK proofs
- **Usability**: Intuitive UI with real-time feedback and status indicators
- **Accessibility**: Mobile-responsive, high contrast design, keyboard navigation
- **Creativity**: Novel approach to privacy-first identity verification

## 🎯 Demo

Live demo: [Your Netlify URL]

## 📞 Support

### Documentation
- [Midnight Setup Guide](MIDNIGHT-SETUP.md)
- [Midnight Network Docs](https://docs.midnight.network/)
- [Challenge Details](https://dev.to/challenges/midnight)

### Community
- [Midnight Discord](https://discord.gg/midnight)
- [DEV Community](https://dev.to/challenges/midnight)

For questions about this challenge submission, please open an issue in the repository.

---

**Built for the Midnight Network "Privacy First" Challenge 2024**  
*Protecting identity through zero-knowledge proofs* 🌙
# AnonShare-Anonymous-Verified-Community
