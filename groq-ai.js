// Groq AI Integration for Better Organization/Role Extraction
class GroqAI {
    constructor() {
        this.apiKey = CONFIG.GROQ_API_KEY;
        this.apiUrl = CONFIG.GROQ_API_URL;
        this.model = CONFIG.GROQ_MODEL;
    }

    async analyzeDocument(ocrText, documentType = 'unknown') {
        if (!this.apiKey) {
            console.warn('Groq API key not available, using text analysis only');
            return this.fallbackAnalysis(ocrText);
        }

        try {
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
                            content: 'Extract organization and role from document text. Return JSON: {"organization": "exact name", "role": "student/employee/citizen"}'
                        },
                        {
                            role: 'user',
                            content: `Document text: "${ocrText}"`
                        }
                    ],
                    temperature: 0.1,
                    max_tokens: 100
                })
            });

            if (!response.ok) {
                console.warn(`Groq API error: ${response.status}, using fallback`);
                return this.fallbackAnalysis(ocrText);
            }

            const data = await response.json();
            const content = data.choices[0].message.content.trim();
            
            try {
                const aiResult = JSON.parse(content);
                
                return {
                    name: '[HASHED]',
                    idNumber: '[HASHED]', 
                    organization: aiResult.organization || this.extractOrganization(ocrText),
                    role: aiResult.role || this.extractRole(ocrText),
                    isValid: true,
                    confidence: 9,
                    documentType: 'government'
                };
            } catch (parseError) {
                console.log('AI returned non-JSON, using fallback analysis');
                return this.fallbackAnalysis(ocrText);
            }
        } catch (error) {
            console.error('Groq AI analysis failed:', error);
            return this.fallbackAnalysis(ocrText);
        }
    }

    fallbackAnalysis(ocrText) {
        return {
            name: '[HASHED]',
            idNumber: '[HASHED]',
            organization: this.extractOrganization(ocrText),
            role: this.extractRole(ocrText),
            isValid: true,
            confidence: 8,
            documentType: 'government'
        };
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

    extractRole(text) {
        if (/student|bachelor|degree|academic|university|college/i.test(text)) return 'Student';
        if (/employee|staff|worker|company|corporation/i.test(text)) return 'Employee';
        if (/government of india|passport|aadhaar|voter|citizen|nationality/i.test(text)) return 'Citizen';
        if (/faculty|professor|teacher/i.test(text)) return 'Faculty';
        return 'Citizen'; // Default for government documents
    }

    extractOrganization(text) {
        const orgPatterns = [
            // Countries/Nationality (for citizens)
            /(GOVERNMENT OF INDIA)/i,
            /(REPUBLIC OF INDIA)/i,
            /(INDIA)/i,
            /(UNITED STATES OF AMERICA)/i,
            /(UNITED KINGDOM)/i,
            /(CANADA)/i,
            /(AUSTRALIA)/i,
            
            // Universities & Colleges
            /(RAJASTHAN TECHNICAL UNIVERSITY)/i,
            /(INDIAN INSTITUTE OF TECHNOLOGY[^,\n]*)/i,
            /(NATIONAL INSTITUTE OF TECHNOLOGY[^,\n]*)/i,
            /([A-Z][a-zA-Z\s]+ UNIVERSITY)/i,
            /([A-Z][a-zA-Z\s]+ COLLEGE)/i,
            /([A-Z][a-zA-Z\s]+ INSTITUTE)/i,
            
            // Companies & MNCs
            /(TATA CONSULTANCY SERVICES)/i,
            /(INFOSYS LIMITED)/i,
            /(MICROSOFT CORPORATION)/i,
            /([A-Z][a-zA-Z\s]+ LIMITED)/i,
            /([A-Z][a-zA-Z\s]+ LTD)/i,
            /([A-Z][a-zA-Z\s]+ INC)/i,
            /([A-Z][a-zA-Z\s]+ CORP)/i
        ];
        
        for (const pattern of orgPatterns) {
            const match = text.match(pattern);
            if (match && match[1] && match[1].length > 2 && !match[1].includes('CARD') && !match[1].includes('NAME')) {
                let org = match[1].trim();
                
                // Convert government references to country names for citizens
                if (org.toUpperCase() === 'GOVERNMENT OF INDIA' || org.toUpperCase() === 'REPUBLIC OF INDIA') {
                    return 'India';
                }
                
                return org;
            }
        }
        
        // Fallback: if it mentions government/passport/aadhaar, it's likely India
        if (/government|passport|aadhaar|voter|nationality/i.test(text)) {
            return 'India';
        }
        
        return 'Organization';
    }
}

// Initialize Groq AI
const groqAI = new GroqAI();
