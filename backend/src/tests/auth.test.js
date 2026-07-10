// Basic test examples for authentication endpoints
// Run with: npm test (after setting up test framework)

const testCases = {
  registration: {
    valid: {
      email: "test@example.com",
      password: "Test123!@#",
      fullName: "Test User",
      phone: "9876543210"
    },
    invalid: {
      weakPassword: {
        email: "test@example.com",
        password: "123",
        fullName: "Test User"
      },
      invalidEmail: {
        email: "invalid-email",
        password: "Test123!@#",
        fullName: "Test User"
      },
      missingFields: {
        email: "test@example.com"
      }
    }
  },
  
  login: {
    valid: {
      email: "test@example.com",
      password: "Test123!@#"
    },
    invalid: {
      wrongPassword: {
        email: "test@example.com",
        password: "wrongpassword"
      },
      nonExistentUser: {
        email: "nonexistent@example.com",
        password: "Test123!@#"
      }
    }
  },

  phoneVerification: {
    valid: {
      phone: "9876543210",
      otp: "123456"
    },
    invalid: {
      wrongOTP: {
        phone: "9876543210",
        otp: "000000"
      },
      invalidPhone: {
        phone: "123",
        otp: "123456"
      }
    }
  }
};

// Test endpoints:
// POST /api/auth/register
// GET /api/auth/verify-email?token=<token>
// POST /api/auth/login
// POST /api/auth/send-otp
// POST /api/auth/verify-phone
// GET /api/auth/google
// GET /api/auth/facebook

console.log('Test cases defined for authentication system');
console.log('Endpoints to test:', Object.keys(testCases));

module.exports = testCases;