// Groq AI Integration for Better Organization/Role Extraction
class GroqAI {
    constructor() {
        this.apiKey = CONFIG.GROQ_API_KEY;
        this.apiUrl = CONFIG.GROQ_API_URL;
        this.model = CONFIG.GROQ_MODEL;
    }

    async analyzeDocument(ocrText, documentType = 'unknown') {
        try {
            // Pre-validate the text
            if (!ocrText || ocrText.trim().length < 10) {
                throw new Error('Insufficient text extracted from image');
            }
            
            const prompt = this.createAnalysisPrompt(ocrText, documentType);
            
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a document analyzer. Only verify real identity documents. Return JSON without markdown.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.1,
                    max_tokens: 200
                })
            });

            if (!response.ok) {
                throw new Error(`Groq API error: ${response.status}`);
            }

            const data = await response.json();
            let content = data.choices[0].message.content.trim();
            
            // Clean up markdown formatting if present
            content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            
            const result = JSON.parse(content);
            console.log('Groq AI analysis:', result);
            
            // Validate the result makes sense
            if (!result.verified || !result.organization || !result.role) {
                throw new Error('Document validation failed - not a valid identity document');
            }
            
            // Convert to expected format
            return {
                name: 'Anonymous User',
                organization: result.organization,
                role: result.role,
                documentType: this.getDocumentType(result.organization, result.role),
                idNumber: 'VERIFIED' + Date.now().toString().slice(-6),
                confidence: 85,
                organizationType: this.getOrgType(result.organization),
                verificationLevel: 'high',
                verified: true
            };
            
        } catch (error) {
            console.error('Groq AI analysis failed:', error);
            throw error; // Don't fall back for invalid documents
        }
    }

    createAnalysisPrompt(ocrText, documentType) {
        return `Analyze this text from a document image. Return ONLY JSON (no markdown):

Text: ${ocrText}

IMPORTANT: Only return verified:true if this is clearly a real identity document (ID card, passport, academic certificate, etc.). If this looks like random text or a regular photo, return verified:false.

Return format:
{"verified": true/false, "organization": "name", "role": "role"}

Document type rules:
- AADHAR/AADHAAR: {"verified": true, "organization": "Government of India", "role": "Citizen"}
- University/College: {"verified": true, "organization": "Full University Name", "role": "Student"}
- Company ID: {"verified": true, "organization": "Company Name", "role": "Employee"}
- Random image/text: {"verified": false, "organization": "Unknown", "role": "Unknown"}

Only verify if you see clear identity document indicators like names, ID numbers, official seals, etc.`;
    }

    getDocumentType(organization, role) {
        if (organization.toLowerCase().includes('government')) return 'aadhar_card';
        if (role.toLowerCase() === 'student') return 'student_id';
        if (role.toLowerCase() === 'employee') return 'employee_id';
        return 'identity_document';
    }

    getOrgType(organization) {
        if (organization.toLowerCase().includes('government')) return 'government';
        if (organization.toLowerCase().includes('university') || organization.toLowerCase().includes('college')) return 'university';
        return 'company';
    }

    getFallbackAnalysis(ocrText) {
        // No fallback - if Groq AI fails, the document is likely invalid
        throw new Error('Document analysis failed - this may not be a valid identity document');
    }
}

// Initialize Groq AI
const groqAI = new GroqAI();
